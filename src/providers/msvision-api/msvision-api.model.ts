export interface MSVisionApiResult {
    categories:  Category[];
    tags:        Tag[];
    description: Description;
    requestId:   string;
    metadata:    Metadata;
}

export interface Category {
  name: string;
  score: number;
}

export interface Description {
    tags:     string[];
    captions: Caption[];
}

export interface Caption {
    text:       string;
    confidence: number;
}

export interface Metadata {
    height: number;
    width:  number;
    format: string;
}

export interface Tag {
    name:       string;
    confidence: number;
    hint?:      string;
}
