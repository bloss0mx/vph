

export interface ARR_CONTENT {
  __ARRAY_KEY__: number | string;
  item?: any;
}

export interface CHGED {
  index: number | string;
  item: any;
}
export interface NO_CHG {
  beforeIdx: number | string;
  afterIdx: number | string;
  beforeItem: any;
  afterItem: any;
}