import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import {
  Purchases,
  LOG_LEVEL,
  PurchasesPackage,
  CustomerInfo,
  PURCHASES_ERROR_CODE,
} from "@revenuecat/purchases-capacitor";

const useRevenueCat = () => {
  const [offerings, setOfferings] = useState<PurchasesPackage[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [monthly, setMonthly] = useState<PurchasesPackage | undefined>();
  const [yearly, setYearly] = useState<PurchasesPackage | undefined>();

  useEffect(() => {
    const fetchRevenueCatData = async () => {
      try {
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG }); // Enable to get debug logs
        if (Capacitor.getPlatform() === "ios") {
          await Purchases.configure({
            apiKey: "appl_fKPmGliwDGflaGwMEEWhVSJaLCj",
          });
          const offerings = await Purchases.getOfferings();
          if (
            offerings.current !== null &&
            offerings.current.availablePackages.length !== 0
          ) {
            offerings.current.availablePackages.forEach((pkg, i) => {
              console.log(`PACKAGE ${i}`, pkg);
            });
            const monthlySubscription =
              offerings.current.availablePackages.find(
                (pkg) => pkg.identifier === "$rc_monthly"
              );
            setMonthly(monthlySubscription);
            const yearlySubscription = offerings.current.availablePackages.find(
              (pkg) => pkg.identifier === "$rc_annual"
            );
            setYearly(yearlySubscription);
            setOfferings(offerings.current.availablePackages);
          }
          const customerInfo = await Purchases.getCustomerInfo();
          console.log(customerInfo.customerInfo.entitlements);
          setCustomerInfo(customerInfo.customerInfo);
          if (customerInfo.customerInfo.entitlements.active["Premium"]) {
            setIsPremiumUser(true);
          }
        }
      } catch (err) {
        setError(err);
        console.error("RevenueCat error: ", err);
      }
    };

    fetchRevenueCatData();
  }, []);

  const purchasePackage = async (packageToBuy: PurchasesPackage) => {
    try {
      const purchaseResult = await Purchases.purchasePackage({
        aPackage: packageToBuy,
      });
      if (purchaseResult.customerInfo.entitlements.active["Premium"]) {
        // Unlock that great "pro" content
        setIsPremiumUser(true);
      }
      setCustomerInfo(purchaseResult.customerInfo); // Update customer info after purchase
    } catch (error) {
      // @ts-ignore
      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        // Purchase cancelled
        console.log("Purchase cancelled");
      } else {
        // Error making purchase
        console.error("Error making purchase: ", error);
        setError(error);
      }
    }
  };

  return {
    offerings,
    customerInfo,
    error,
    purchasePackage,
    isPremiumUser,
    monthly,
    yearly,
  };
};

export default useRevenueCat;
