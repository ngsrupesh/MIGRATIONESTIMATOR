import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Migration } from '../../models/migration.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-migration-form',
  templateUrl: './migration-form.component.html',
  styleUrls: ['./migration-form.component.css']
})
export class MigrationFormComponent implements OnInit {
  migrationForm: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  
  sourceEnvironments = ['SharePoint On-Premises', 'File Share', 'Box', 'Google Drive'];
  destinationEnvironments = ['SharePoint Online', 'OneDrive'];
  yesNoOptions = ['Yes', 'No'];
  volumeUnits = ['GB', 'TB'];

  dataTypeOptions: string[] = [];
  
  private sharePointDataTypes = ['Lists', 'Libraries', 'Workflows', 'InfoPath Forms', 'Custom Codes', 'SQL Server Database'];
  private fileShareDataTypes = ['Documents', 'Media'];

  packages = [
    {
      name: 'Kickstart',
      features: [
        'setup',
        'a pilot migration with a limited data set',
        'knowledge transfer',
        'Set up guide'
      ]
    },
    {
      name: 'Guided',
      features: [
        'setup',
        'a pilot migration with a limited data set',
        'knowledge transfer',
        'Set up guide',
        'data cleanup',
        'Governance Plan',
        'Customer Support with the migration'
      ]
    },
    {
      name: 'Full-Service',
      features: [
        'setup',
        'a pilot migration with a limited data set',
        'knowledge transfer',
        'Set up guide',
        'data cleanup',
        'Governance Plan',
        'Customer Support',
        'information architecture',
        'Managing the entire migration',
        '90 Days Post Migration Support'
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.migrationForm = this.fb.group({
      sourceEnvironment: [''],
      destinationEnvironment: [''],
      dataVolume: [''],
      dataVolumeUnit: ['GB'],
      existingDataAnalysis: [''],
      contentTypes: [[]],
      permissions: [''],
      versionHistory: [''],
      dataScrubbing: [''],
      informationArchitecture: [''],
      governanceAndCompliance: [''],
      userTrainingAndSupport: [''],
      timeline: [0],
      startDate: [new Date()],
      budget: [''],
      selectedPackage: [null]
    });

    this.migrationForm.get('sourceEnvironment')?.valueChanges.subscribe(value => {
      this.updateDataTypes(value);
      this.migrationForm.get('contentTypes')?.setValue([]);
    });
  }

  ngOnInit(): void {}

  private updateDataTypes(sourceEnvironment: string) {
    if (sourceEnvironment === 'SharePoint On-Premises') {
      this.dataTypeOptions = this.sharePointDataTypes;
    } else {
      this.dataTypeOptions = this.fileShareDataTypes;
    }
  }

  formatTimelineLabel(value: number): string {
    if (value === 0) return '0 months';
    if (value < 12) return `${value} months`;
    const years = Math.floor(value / 12);
    const months = value % 12;
    return months > 0 ? `${years}y ${months}m` : `${years} years`;
  }

  selectPackage(packageName: string) {
    this.migrationForm.patchValue({ selectedPackage: packageName });
  }

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }

  generatePDF() {
    const doc = new jsPDF();
    const formData = this.migrationForm.value;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = 20;

    // Add watermark
    doc.setFontSize(50);
    doc.setTextColor(150, 150, 150, 0.7);
    
    // Calculate center position
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    
    // Add rotated watermark text with reduced opacity by using lighter color
    const angle = -45;
    doc.setTextColor(150, 150, 150, 0.7); // Using rgba to set opacity
    doc.text('Confidential', centerX, centerY, {
      align: 'center',
      angle: angle
    });
    doc.text('Property of XYZ Corp', centerX, centerY + 30, {
      align: 'center',
      angle: angle
    });

    // Reset text properties for content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Title
    doc.setFontSize(16);
    doc.text('Migration Assessment Report', margin, yPos);
    yPos += 10;

    // Reset font size
    doc.setFontSize(12);

    // Environment Details
    doc.text('Environment Details:', margin, yPos += 10);
    doc.text(`Source: ${formData.sourceEnvironment}`, margin, yPos += 8);
    doc.text(`Destination: ${formData.destinationEnvironment}`, margin, yPos += 8);
    doc.text(`Data Volume: ${formData.dataVolume} ${formData.dataVolumeUnit}`, margin, yPos += 8);
    doc.text(`Content Types: ${formData.contentTypes.join(', ')}`, margin, yPos += 8);

    // Additional Details
    yPos += 10;
    doc.text('Additional Details:', margin, yPos);
    doc.text(`Permissions: ${formData.permissions}`, margin, yPos += 8);
    doc.text(`Version History: ${formData.versionHistory}`, margin, yPos += 8);
    doc.text(`Data Scrubbing: ${formData.dataScrubbing}`, margin, yPos += 8);

    // Timeline and Budget
    yPos += 10;
    doc.text('Timeline and Budget:', margin, yPos);
    doc.text(`Timeline: ${this.formatTimelineLabel(formData.timeline)}`, margin, yPos += 8);
    doc.text(`Start Date: ${formData.startDate.toLocaleDateString()}`, margin, yPos += 8);
    doc.text(`Budget: ${formData.budget}`, margin, yPos += 8);

    // Selected Package
    yPos += 10;
    doc.text('Selected Package:', margin, yPos);
    doc.text(`${formData.selectedPackage}`, margin, yPos += 8);

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Save the PDF
    doc.save(`migration-assessment-${dateString}.pdf`);
  }

  onSubmit() {
    if (this.migrationForm.valid) {
      this.generatePDF();
    }
  }
}