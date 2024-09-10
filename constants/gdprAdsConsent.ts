// https://docs.page/invertase/react-native-google-mobile-ads/european-user-consent
import mobileAds, {
  AdsConsent,
  AdsConsentDebugGeography,
} from "react-native-google-mobile-ads";

// Initialize AdsMob
function initializeMobileAdsSdk() {
  mobileAds()
    .initialize()
    .then((adapterStatuses) => {
      console.log("mobileAds initialize:", adapterStatuses);
    });
}

// Check consent status
async function checkIsNotAgreement() {
  const {
    activelyScanDeviceCharacteristicsForIdentification,
    applyMarketResearchToGenerateAudienceInsights,
    createAPersonalisedAdsProfile,
    createAPersonalisedContentProfile,
    developAndImproveProducts,
    measureAdPerformance,
    measureContentPerformance,
    selectBasicAds,
    selectPersonalisedAds,
    selectPersonalisedContent,
    storeAndAccessInformationOnDevice,
    usePreciseGeolocationData,
  } = await AdsConsent.getUserChoices();

  return (
    applyMarketResearchToGenerateAudienceInsights === false ||
    createAPersonalisedAdsProfile === false ||
    createAPersonalisedContentProfile === false ||
    developAndImproveProducts === false ||
    measureAdPerformance === false ||
    measureContentPerformance === false ||
    selectBasicAds === false ||
    selectPersonalisedAds === false ||
    selectPersonalisedContent === false ||
    storeAndAccessInformationOnDevice === false ||
    usePreciseGeolocationData === false
  );
}

async function requestConsent() {
  return await AdsConsent.requestInfoUpdate();
  //return await AdsConsent.requestInfoUpdate(debugParams); // Add debugParams during testing
}

// Load GDPR consent form and check consent status
export async function loadGdprAdsConsent() {
  try {
    //await AdsConsent.reset(); // Uncomment for testing
    const data = await requestConsent();

    if (data.isConsentFormAvailable) {
      const resultForm = await AdsConsent.loadAndShowConsentFormIfRequired();

      // If the user has already consented or refused consent, check the consent status and request consent if needed
      if (data.status === "OBTAINED") {
        const isNotAgreement = await checkIsNotAgreement();

        if (isNotAgreement) {
          await AdsConsent.showForm();
        }
      }

      if (resultForm.canRequestAds === true) {
        initializeMobileAdsSdk();
      }
    } else {
      initializeMobileAdsSdk();
    }
  } catch (error) {
    console.log("loadGdprAdsConsent > error: ", error);
    initializeMobileAdsSdk();
  }
}

// Check if Consent is Available (EEA region)
export async function checkIsConsentAvailable() {
  try {
    const data = await requestConsent();
    //console.log('checkConsentAvailable > data: ', data);

    return data.isConsentFormAvailable;
  } catch (error) {
    console.log("checkConsentAvailable > error: ", error);
    return false;
  }
}

// Show consent form on button click or screen navigation, and check consent status afterward
export async function showAdsConsentForm(
  consentCallback?: () => void,
  notConsentCallback?: () => void
) {
  try {
    const data = await requestConsent();

    if (data.isConsentFormAvailable) {
      const isNotAgreement = await checkIsNotAgreement();

      if (isNotAgreement) {
        await AdsConsent.showForm();

        // Re-check consent status
        const isNotAgreementResult = await checkIsNotAgreement();

        if (isNotAgreementResult) {
          // Handle non-consent
          notConsentCallback && notConsentCallback();
        } else {
          // Handle consent
          consentCallback && consentCallback();
        }
      } else {
        // Handle consent
        consentCallback && consentCallback();
      }
    } else {
      // Handle case where no consent form is available
      consentCallback && consentCallback();
    }
  } catch (error) {
    console.log("showAdsConsentForm > error: ", error);
  }
}

// Show privacy options form in settings
export async function showPrivacyOptionsForm() {
  try {
    const data = await requestConsent();

    if (data.isConsentFormAvailable) {
      await AdsConsent.showPrivacyOptionsForm();
    }
  } catch (error) {
    console.log("showPrivacyOptionsForm > error: ", error);
  }
}
