export interface RestaurantSearchResult {
    address:     Address;
    restaurants: Restaurant[];
}

export interface Address {
    apiKey:        string;
    streetAddress: string;
    latitude:      number;
    longitude:     number;
    city:          string;
    state:         string;
    zip:           string;
    aptNumber:     string;
}

export interface Restaurant {
    apiKey:           string;
    deliveryMin:      number;
    deliveryPrice?:   number;
    logoUrl:          string;
    name:             string;
    streetAddress:    string;
    city:             string;
    state:            string;
    zip:              string;
    foodTypes:        string[];
    phone:            string;
    latitude:         number;
    longitude:        number;
    minFreeDelivery:  number;
    taxRate:          number;
    acceptsCash:      boolean;
    acceptsCard:      boolean;
    offersPickup:     boolean;
    offersDelivery:   boolean;
    isTestRestaurant: boolean;
    minWaitTime:      number;
    maxWaitTime:      number;
    open:             boolean;
    url:              string;
    hours:            Hours;
    timezone:         string;
}

export interface Hours {
    Monday:     string[];
    Wednesday?: string[];
    Tuesday?:   string[];
    Friday?:    string[];
    Thursday?:  string[];
    Saturday?:  string[];
    Sunday?:    string[];
}

export interface RestaurantMenuNode {
    apiKey:       string;
    name:         string;
    items?:       RestaurantMenuNode[];
    description?: string;
    basePrice?:   number;
}
