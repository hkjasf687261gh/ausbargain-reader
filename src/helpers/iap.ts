import {
  IAPProduct,
  InAppPurchase2,
} from "@awesome-cordova-plugins/in-app-purchase-2";

export const iapStore = InAppPurchase2;

export const purchaseItems = {
  donation: {
    id: 'donation1'
  }
}

export function setupIonicInAppPurchase() {
  document.addEventListener("deviceready", () => {
    iapStore.verbosity = iapStore.DEBUG;

    iapStore.register({
      id: purchaseItems.donation.id,
      type: iapStore.NON_CONSUMABLE,
    });
  
    // Register event handlers for the specific product
    iapStore.when(purchaseItems.donation.id).registered((product: IAPProduct) => {
      console.log("Registered: " + JSON.stringify(product));
    });
  
    // Updated
    iapStore.when(purchaseItems.donation.id).updated((product: IAPProduct) => {
      console.log("Updated: " + JSON.stringify(product));
    });
  
    // User closed the native purchase dialog
    iapStore.when(purchaseItems.donation.id).cancelled((product: IAPProduct) => {
      console.error("Purchase was Cancelled: " + JSON.stringify(product));
    });
  
    // Track all store errors
    iapStore.error((err: any) => {
      console.error("Store Error " + JSON.stringify(err));
    });
  
    // Run some code only when the store is ready to be used
    iapStore.ready(() => {
      console.log("Store is ready");
      console.log("Products: " + JSON.stringify(iapStore.products));
      console.log(JSON.stringify(iapStore.get(purchaseItems.donation.id)));
    });
  
    // // Refresh the status of in-app products
    iapStore.refresh();
  
    // // To make a purchase
    // iapStore.order(purchaseItems.donation.id);
  });
}