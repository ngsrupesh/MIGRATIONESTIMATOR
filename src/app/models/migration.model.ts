export interface Migration {
  sourceEnvironment: 'SharePoint On-Premises' | 'File Share' | 'Box' | 'Google Drive';
  destinationEnvironment: 'SharePoint Online' | 'OneDrive';
  dataVolume: number;
  dataVolumeUnit: 'GB' | 'TB';
  existingDataAnalysis: 'Yes' | 'No';
  contentTypes: string[];
  permissions: string;
  versionHistory: string;
  dataScrubbing: string;
  informationArchitecture: string;
  governanceAndCompliance: string;
  userTrainingAndSupport: 'Yes' | 'No';
  timeline: number;
  startDate: Date;
  budget: string;
  selectedPackage: 'Kickstart' | 'Guided' | 'Full-Service' | null;
}