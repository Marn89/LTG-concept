export interface TechObjektas {
  objectDescription: string
  planningPlant: string
  functionalLocation: string
  functLocDescrip: string
  selectedLine?: string
  equipment?: string
  objectType?: string
  modelNumber?: string
  inventoryNumber?: string
  equipmentCategory?: string
  costCenter?: string
  constructionMonth?: string
  constructionYear?: string
  createdOn?: string
  maintenancePlant?: string
  technicalIdentNo?: string
  userStatus?: string
  settlementPBE?: string
  settlementShipping?: string
  planningGroup?: string
  abcIndicator?: string
  addressNumber?: string
  changedOn?: string
  changedBy?: string
  asset?: string
  subNumber?: string
  acquisitionDate?: string
  acquisitionValue?: string
  workCenter?: string
  order?: string
  deliveryDate?: string
  plantSection?: string
  authorizGroup?: string
  grossWeight?: string
  companyCode?: string
  stockBatch?: string
  batch?: string
  city?: string
  district?: string
  countryRegionKey?: string
  internalObjectNo?: string
  validFrom?: string
  validTo?: string
  standingOrder?: string
  sortField?: string
  usgePerConsecNo?: string
  nxtUsagePeriodNo?: string
  timeSegChangedOn?: string
  timeSegChangedBy?: string
  timeSegCreatedOn?: string
  timeSegCreatedBy?: string
  createdBy?: string
  descrCustomWarranty?: string
  descrVendorWarranty?: string
  unitOfWeight?: string
  mainWorkCenter?: string
  sizeDimension?: string
  businessArea?: string
  custWarrantyStart?: string
  vendorWrtyStart?: string
  custWarrantyEnd?: string
  vendorWarrantyEnd?: string
  position?: string
  supordEquipment?: string
  mfrCtryReg?: string
  manufacturer?: string
  manufDrawingNumber?: string
  locAcctAssignment?: string
  startupDate?: string
  maintPlannerGroup?: string
  docCatAllowed?: string
  planningIndicator?: string
  ownExternalEqui?: string
  owner?: string
  procurementType?: string
  fictitious?: string
  materialPriceGrp?: string
  provisionFeeInd?: string
  relToLoadCosts?: string
  itemMultipartInd?: string
  leasingType?: string
  pmOrderOwner?: string
  pmOrderAdmin?: string
  unitMeasSettl?: string
  administrator?: string
  cdEquipment?: string
  licensePlateNumber?: string
  salesOrder?: string
  salesOrderItem?: string
  configurableMaterial?: string
  controllingArea?: string
  referencedConfig?: string
  longTextExists?: string
  storageLocation?: string
  stockTypePrimary?: string
  licenseNumber?: string
  materialDescription?: string
  manufactPartNo?: string
  material?: string
  cusMasterWarranty?: string
  venMasterWarranty?: string
  room?: string
  listName?: string
  objectNumber?: string
  postalCode?: string
  wbsElement?: string
  wbsSerialData?: string
  catalogProfile?: string
  region?: string
  profitSegmtNo?: string
  manufSerialNumber?: string
  serialNumber?: string
  specialStock?: string
  division?: string
  languageKey?: string
  location?: string
  street?: string
  systemStatus?: string
  constructionType?: string
  construcTypeDesc?: string
  equipmentDataExists?: string
  telephone?: string
  time?: string
  salesOrganization?: string
  distributionChannel?: string
  currency?: string
  plant?: string
  startPoint?: string
  endPoint?: string
  length?: string
  unitOfMeasure?: string
  linearRefPattern?: string
  startMarker?: string
  distStartMkr?: string
  endMarker?: string
  distEndMarker?: string
  markerDistanceUnit?: string
  typeFirstOffset?: string
  valueOffset1?: string
  uomOffset1?: string
  typeSecondOffset?: string
  valueOffset2?: string
  uomOffset2?: string
}

export const TECH_OBJEKTAI: TechObjektas[] = [
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00003', functLocDescrip: 'Iešmas Nr.3K' },
  {
    objectDescription: 'Balastas',
    planningPlant: 'DA01',
    functionalLocation: 'LG-L08-000SUB-IESA-IP00003',
    functLocDescrip: 'Iešmas Nr.3K',
    equipment: '10079101',
    objectType: 'I',
    inventoryNumber: '247-0003834',
    equipmentCategory: 'I',
    costCenter: 'D0K6043321',
    createdOn: '2023-06-16',
    createdBy: 'KKRALETI',
    maintenancePlant: 'DP03',
    userStatus: 'INOP',
    systemStatus: 'INST',
    abcIndicator: 'A',
    changedOn: '2023-06-16',
    changedBy: 'KKRALETI',
    validFrom: '2023-06-16',
    validTo: '9999-12-31',
    objectNumber: 'IE000000000010079101',
    languageKey: 'EN',
    companyCode: 'LTG0',
    constructionMonth: '06',
    constructionYear: '2020',
    startupDate: '2020-06-01',
    manufacturer: 'Rautaruukki Oyj',
    mfrCtryReg: 'FI',
    serialNumber: '000000577434',
    modelNumber: 'BLT-22-SH',
    technicalIdentNo: 'TID-2023-08834',
    mainWorkCenter: 'KELIAI01',
    workCenter: 'KELIAI01',
    plantSection: 'K01',
    maintPlannerGroup: 'DP0',
    planningGroup: 'DP0',
    catalogProfile: 'LTG-KELIAI',
    planningIndicator: '1',
    businessArea: 'INF',
    controllingArea: 'LT01',
    acquisitionDate: '2020-06-01',
    acquisitionValue: '4 200,00',
    asset: '000070810P80',
    subNumber: '0000',
    wbsElement: 'LTG-INFRA-2020-0042',
    plant: 'DA01',
    location: 'Šiauliai',
    city: 'Šiauliai',
    district: 'Šiaulių r.',
    street: 'Pramonės g. 14',
    postalCode: 'LT-76299',
    countryRegionKey: 'LT',
    region: 'LT-SA',
    grossWeight: '1 800,000',
    unitOfWeight: 'KG',
    sizeDimension: '2500 x 300 x 220 mm',
    constructionType: 'BALASTASP',
    sortField: 'IESA-IP00003',
    administrator: 'KKRALETI',
  },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00003', functLocDescrip: 'Iešmas Nr.3K' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00003', functLocDescrip: 'Iešmas Nr.3K' },
  { objectDescription: 'Izoliuotos iešminės sandūros', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00003', functLocDescrip: 'Iešmas Nr.3K' },
  { objectDescription: 'Rėminis bėgis su smaile', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00004', functLocDescrip: 'Iešmas Nr.4' },
  { objectDescription: 'Kryžmė', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00004', functLocDescrip: 'Iešmas Nr.4' },
  { objectDescription: 'Gretbėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00004', functLocDescrip: 'Iešmas Nr.4' },
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00004', functLocDescrip: 'Iešmas Nr.4' },
  { objectDescription: 'Balastas', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00004', functLocDescrip: 'Iešmas Nr.4' },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00004', functLocDescrip: 'Iešmas Nr.4' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00004', functLocDescrip: 'Iešmas Nr.4' },
  { objectDescription: 'Izoliuotos iešminės sandūros', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00004', functLocDescrip: 'Iešmas Nr.4' },
  { objectDescription: 'Rėminis bėgis su smaile', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00005', functLocDescrip: 'Iešmas Nr.5' },
  { objectDescription: 'Kryžmė', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00005', functLocDescrip: 'Iešmas Nr.5' },
  { objectDescription: 'Gretbėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00005', functLocDescrip: 'Iešmas Nr.5' },
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00005', functLocDescrip: 'Iešmas Nr.5' },
  { objectDescription: 'Balastas', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00005', functLocDescrip: 'Iešmas Nr.5' },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00005', functLocDescrip: 'Iešmas Nr.5' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00005', functLocDescrip: 'Iešmas Nr.5' },
  { objectDescription: 'Izoliuotos iešminės sandūros', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00005', functLocDescrip: 'Iešmas Nr.5' },
  { objectDescription: 'Rėminis bėgis su smaile', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00006', functLocDescrip: 'Iešmas Nr.6' },
  { objectDescription: 'Kryžmė', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00006', functLocDescrip: 'Iešmas Nr.6' },
  { objectDescription: 'Gretbėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00006', functLocDescrip: 'Iešmas Nr.6' },
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00006', functLocDescrip: 'Iešmas Nr.6' },
  { objectDescription: 'Balastas', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00006', functLocDescrip: 'Iešmas Nr.6' },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00006', functLocDescrip: 'Iešmas Nr.6' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00006', functLocDescrip: 'Iešmas Nr.6' },
  { objectDescription: 'Izoliuotos iešminės sandūros', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00006', functLocDescrip: 'Iešmas Nr.6' },
  { objectDescription: 'Rėminis bėgis su smaile', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00007', functLocDescrip: 'Iešmas Nr.7' },
  { objectDescription: 'Kryžmė', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00007', functLocDescrip: 'Iešmas Nr.7' },
  { objectDescription: 'Gretbėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00007', functLocDescrip: 'Iešmas Nr.7' },
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00007', functLocDescrip: 'Iešmas Nr.7' },
  { objectDescription: 'Balastas', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00007', functLocDescrip: 'Iešmas Nr.7' },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00007', functLocDescrip: 'Iešmas Nr.7' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00007', functLocDescrip: 'Iešmas Nr.7' },
  { objectDescription: 'Izoliuotos iešminės sandūros', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00007', functLocDescrip: 'Iešmas Nr.7' },
  { objectDescription: 'Rėminis bėgis su smaile', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00008', functLocDescrip: 'Iešmas Nr.8' },
  { objectDescription: 'Kryžmė', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00008', functLocDescrip: 'Iešmas Nr.8' },
  { objectDescription: 'Gretbėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00008', functLocDescrip: 'Iešmas Nr.8' },
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00008', functLocDescrip: 'Iešmas Nr.8' },
  { objectDescription: 'Balastas', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00008', functLocDescrip: 'Iešmas Nr.8' },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00008', functLocDescrip: 'Iešmas Nr.8' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00008', functLocDescrip: 'Iešmas Nr.8' },
  { objectDescription: 'Izoliuotos iešminės sandūros', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00008', functLocDescrip: 'Iešmas Nr.8' },
  { objectDescription: 'Rėminis bėgis su smaile', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00009', functLocDescrip: 'Iešmas Nr.9' },
  { objectDescription: 'Kryžmė', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00009', functLocDescrip: 'Iešmas Nr.9' },
  { objectDescription: 'Gretbėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00009', functLocDescrip: 'Iešmas Nr.9' },
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00009', functLocDescrip: 'Iešmas Nr.9' },
  { objectDescription: 'Balastas', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00009', functLocDescrip: 'Iešmas Nr.9' },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00009', functLocDescrip: 'Iešmas Nr.9' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00009', functLocDescrip: 'Iešmas Nr.9' },
  { objectDescription: 'Izoliuotos iešminės sandūros', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00009', functLocDescrip: 'Iešmas Nr.9' },
  { objectDescription: 'Rėminis bėgis su smaile', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00010', functLocDescrip: 'Iešmas Nr.10' },
  { objectDescription: 'Kryžmė', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00010', functLocDescrip: 'Iešmas Nr.10' },
  { objectDescription: 'Gretbėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00010', functLocDescrip: 'Iešmas Nr.10' },
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00010', functLocDescrip: 'Iešmas Nr.10' },
  { objectDescription: 'Balastas', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00010', functLocDescrip: 'Iešmas Nr.10' },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00010', functLocDescrip: 'Iešmas Nr.10' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00010', functLocDescrip: 'Iešmas Nr.10' },
  { objectDescription: 'Izoliuotos iešminės sandūros', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00010', functLocDescrip: 'Iešmas Nr.10' },
  { objectDescription: 'Rėminis bėgis su smaile', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00012', functLocDescrip: 'Iešmas Nr.12' },
  { objectDescription: 'Kryžmė', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00012', functLocDescrip: 'Iešmas Nr.12' },
  { objectDescription: 'Gretbėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00012', functLocDescrip: 'Iešmas Nr.12' },
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00012', functLocDescrip: 'Iešmas Nr.12' },
  { objectDescription: 'Balastas', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00012', functLocDescrip: 'Iešmas Nr.12' },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00012', functLocDescrip: 'Iešmas Nr.12' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00012', functLocDescrip: 'Iešmas Nr.12' },
  { objectDescription: 'Izoliuotos iešminės sandūros', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00012', functLocDescrip: 'Iešmas Nr.12' },
  { objectDescription: 'Pervedimo įranga', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00014', functLocDescrip: 'Iešmas Nr.14' },
  { objectDescription: 'Rėminis bėgis su smaile', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00014', functLocDescrip: 'Iešmas Nr.14' },
  { objectDescription: 'Kryžmė', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00014', functLocDescrip: 'Iešmas Nr.14' },
  { objectDescription: 'Gretbėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00014', functLocDescrip: 'Iešmas Nr.14' },
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00014', functLocDescrip: 'Iešmas Nr.14' },
  { objectDescription: 'Balastas', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00014', functLocDescrip: 'Iešmas Nr.14' },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00014', functLocDescrip: 'Iešmas Nr.14' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00014', functLocDescrip: 'Iešmas Nr.14' },
  { objectDescription: 'Pervedimo įranga', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00016', functLocDescrip: 'Iešmas Nr.16' },
  { objectDescription: 'Rėminis bėgis su smaile', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00016', functLocDescrip: 'Iešmas Nr.16' },
  { objectDescription: 'Kryžmė', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00016', functLocDescrip: 'Iešmas Nr.16' },
  { objectDescription: 'Gretbėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00016', functLocDescrip: 'Iešmas Nr.16' },
  { objectDescription: 'Iešminiai pabėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00016', functLocDescrip: 'Iešmas Nr.16' },
  { objectDescription: 'Balastas', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00016', functLocDescrip: 'Iešmas Nr.16' },
  { objectDescription: 'Sąvaržos', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00016', functLocDescrip: 'Iešmas Nr.16' },
  { objectDescription: 'Bėgiai', planningPlant: '', functionalLocation: 'LG-L08-000SUB-IESA-IP00016', functLocDescrip: 'Iešmas Nr.16' },
]
