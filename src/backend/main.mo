import Map "mo:core/Map";
import Principal "mo:core/Principal";

import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Specify the data migration funtion in with-clause. In this case,
// the data migration function will add the userProfiles profile tracking,
// which will persist on subsequent upgrades.

actor {
  // set up authorization and authentication System
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    displayName : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // get the profile of the user making the request
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // simple greet function - accessible to all including guests
  public query ({ caller }) func greet(name : Text) : async Text {
    "Hello, " # name # "!";
  };

  // MedyAI medical assistant code
  type QueryType = { #prescription; #symptom; #advice };

  type QueryLog = {
    id : Nat;
    queryType : QueryType;
    timestamp : Int;
    summary : Text;
  };

  var nextId = 1;

  // Per-user query logs for privacy
  let userQueries = Map.empty<Principal, List.List<QueryLog>>();

  type PrescriptionAnalysis = {
    medicineName : Text;
    dosage : Text;
    frequency : Text;
    confidenceLevel : Text;
    notes : Text;
  };

  type ImageAnalysis = {
    observation : Text;
    possibleCause : Text;
    whatToDo : Text;
    disclaimer : Text;
  };

  type MedicalAdvice = {
    possibleReasons : Text;
    generalAdvice : Text;
    homeCareTips : [Text];
    disclaimer : Text;
  };

  func containsKeyword(text : Text, keywords : [Text]) : Bool {
    keywords.any(func(keyword) { text.toLower().contains(#text keyword) });
  };

  func getCurrentTime() : Int {
    Time.now();
  };

  func logQuery(caller : Principal, queryType : QueryType, summary : Text) {
    let queryLog = {
      id = nextId;
      queryType;
      timestamp = getCurrentTime();
      summary;
    };
    
    let userQueryList = switch (userQueries.get(caller)) {
      case (null) { List.empty<QueryLog>() };
      case (?list) { list };
    };
    
    userQueryList.add(queryLog);
    userQueries.add(caller, userQueryList);
    nextId += 1;
  };

  func getQueryById(caller : Principal, id : Nat) : ?QueryLog {
    switch (userQueries.get(caller)) {
      case (null) { null };
      case (?list) {
        list.toArray().find(func(logEntry) { logEntry.id == id });
      };
    };
  };

  public query ({ caller }) func getQuery(id : Nat) : async QueryLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access medical queries");
    };
    
    switch (getQueryById(caller, id)) {
      case (null) { Runtime.trap("Query log not found") };
      case (?logEntry) { logEntry };
    };
  };

  public query ({ caller }) func getAllQueries() : async [QueryLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access medical queries");
    };
    
    switch (userQueries.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  public query ({ caller }) func getRecentQueries() : async [QueryLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access medical queries");
    };
    
    let allQueries = switch (userQueries.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
    
    let sortedQueries = allQueries.sort(
      func(a, b) {
        Nat.compare(b.id, a.id);
      }
    );

    if (sortedQueries.size() <= 20) {
      return sortedQueries;
    } else {
      let iter = sortedQueries.values();
      let filtered = List.empty<QueryLog>();
      var count = 0;
      for (logEntry in iter) {
        if (count < 20) {
          filtered.add(logEntry);
          count += 1;
        };
      };
      filtered.reverse().toArray();
    };
  };

  public query ({ caller }) func analyzePrescription(prescriptionText : Text) : async PrescriptionAnalysis {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can analyze prescriptions");
    };
    
    let text = prescriptionText.toLower();

    let amoxicillinKeywords = ["amoxicillin"];
    let ibuprofenKeywords = ["ibuprofen"];
    let paracetamolKeywords = ["paracetamol", "acetaminophen"];
    let lipitorKeywords = ["lipitor", "atorvastatin"];
    let metforminKeywords = ["metformin", "glucophage"];
    let cetirizineKeywords = ["cetirizine", "zyrtec"];
    let omeprazoleKeywords = ["omeprazole", "prilosec"];
    let azithromycinKeywords = ["azithromycin", "azithro"];
    let pantoprazoleKeywords = ["pantoprazole", "protonix"];
    let aspirinKeywords = ["aspirin"];
    let ciprofloxacinKeywords = ["ciprofloxacin", "cipro"];
    let doxycyclineKeywords = ["doxycycline", "doxy"];

    if (containsKeyword(text, amoxicillinKeywords)) {
      logQuery(caller, #prescription, "Amoxicillin - 500mg, confident match");
      return {
        medicineName = "Amoxicillin";
        dosage = "500mg";
        frequency = "3 times a day";
        confidenceLevel = "High";
        notes = "Common antibiotic prescription.";
      };
    };

    if (containsKeyword(text, ibuprofenKeywords)) {
      logQuery(caller, #prescription, "Ibuprofen - 400mg, confident match");
      return {
        medicineName = "Ibuprofen";
        dosage = "400mg";
        frequency = "Every 6-8 hours as needed";
        confidenceLevel = "High";
        notes = "Common pain reliever and anti-inflammatory medication.";
      };
    };

    if (containsKeyword(text, paracetamolKeywords)) {
      logQuery(caller, #prescription, "Paracetamol - 500mg, confident match");
      return {
        medicineName = "Paracetamol (Acetaminophen)";
        dosage = "500mg";
        frequency = "Every 4-6 hours as needed";
        confidenceLevel = "High";
        notes = "Common pain reliever and fever reducer.";
      };
    };

    if (containsKeyword(text, lipitorKeywords)) {
      logQuery(caller, #prescription, "Lipitor - 20mg, moderate confidence");
      return {
        medicineName = "Lipitor (Atorvastatin)";
        dosage = "20mg";
        frequency = "Once daily";
        confidenceLevel = "Medium";
        notes = "Cholesterol-lowering medication.";
      };
    };

    if (containsKeyword(text, metforminKeywords)) {
      logQuery(caller, #prescription, "Metformin - 500mg, moderate confidence");
      return {
        medicineName = "Metformin (Glucophage)";
        dosage = "500mg";
        frequency = "2 times a day";
        confidenceLevel = "Medium";
        notes = "Diabetes medication to control blood sugar levels.";
      };
    };

    if (containsKeyword(text, cetirizineKeywords)) {
      logQuery(caller, #prescription, "Cetirizine - 10mg, moderate confidence");
      return {
        medicineName = "Cetirizine (Zyrtec)";
        dosage = "10mg";
        frequency = "Once daily as needed";
        confidenceLevel = "Medium";
        notes = "Allergy medication.";
      };
    };

    if (containsKeyword(text, omeprazoleKeywords)) {
      logQuery(caller, #prescription, "Omeprazole - 20mg, moderate confidence");
      return {
        medicineName = "Omeprazole (Prilosec)";
        dosage = "20mg";
        frequency = "Once daily before meals";
        confidenceLevel = "Medium";
        notes = "Stomach acid reducer.";
      };
    };

    if (containsKeyword(text, azithromycinKeywords)) {
      logQuery(caller, #prescription, "Azithromycin - 500mg, moderate confidence");
      return {
        medicineName = "Azithromycin";
        dosage = "500mg";
        frequency = "Once daily for 3-5 days";
        confidenceLevel = "Medium";
        notes = "Antibiotic used to treat infections.";
      };
    };

    if (containsKeyword(text, pantoprazoleKeywords)) {
      logQuery(caller, #prescription, "Pantoprazole - 40mg, moderate confidence");
      return {
        medicineName = "Pantoprazole (Protonix)";
        dosage = "40mg";
        frequency = "Once daily before meals";
        confidenceLevel = "Medium";
        notes = "Stomach acid reducer.";
      };
    };

    if (containsKeyword(text, aspirinKeywords)) {
      logQuery(caller, #prescription, "Aspirin - 81mg, moderate confidence");
      return {
        medicineName = "Aspirin";
        dosage = "81mg";
        frequency = "Once daily for heart health";
        confidenceLevel = "Medium";
        notes = "Blood thinner and pain reliever.";
      };
    };

    if (containsKeyword(text, ciprofloxacinKeywords)) {
      logQuery(caller, #prescription, "Ciprofloxacin - 500mg, moderate confidence");
      return {
        medicineName = "Ciprofloxacin (Cipro)";
        dosage = "500mg";
        frequency = "2 times a day";
        confidenceLevel = "Medium";
        notes = "Antibiotic for bacterial infections.";
      };
    };

    if (containsKeyword(text, doxycyclineKeywords)) {
      logQuery(caller, #prescription, "Doxycycline - 100mg, moderate confidence");
      return {
        medicineName = "Doxycycline (Doxy)";
        dosage = "100mg";
        frequency = "2 times a day";
        confidenceLevel = "Medium";
        notes = "Antibiotic for infections.";
      };
    };

    logQuery(caller, #prescription, "Unidentified prescription, low confidence");
    {
      medicineName = "Unable to confidently identify";
      dosage = "N/A";
      frequency = "N/A";
      confidenceLevel = "Low";
      notes = "Prescription text unclear or unrecognized. Please clarify the medication name or consult a pharmacist.";
    };
  };

  public query ({ caller }) func analyzeSymptomImage(imageDescription : Text) : async ImageAnalysis {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can analyze symptoms");
    };
    
    let text = imageDescription.toLower();

    let scarKeywords = ["scar", "cicatrix"];
    let woundKeywords = ["wound", "cut", "laceration"];
    let rashKeywords = ["rash", "hives", "eruption"];
    let bruiseKeywords = ["bruise", "contusion", "hematoma"];
    let burnKeywords = ["burn", "scald", "thermal injury"];
    let swellingKeywords = ["swelling", "bump", "lump"];
    let acneKeywords = ["acne", "pimple", "zit"];
    let blisterKeywords = ["blister", "bubble", "fluid-filled bump"];
    let insectBiteKeywords = ["insect bite", "sting", "mosquito", "spider"];

    if (containsKeyword(text, scarKeywords)) {
      logQuery(caller, #symptom, "Scar tissue identified");
      return {
        observation = "Scar tissue identified.";
        possibleCause = "Previous injury or surgery.";
        whatToDo = "Monitor for changes in appearance. Consult dermatologist if concerned.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, woundKeywords)) {
      logQuery(caller, #symptom, "Open wound detected");
      return {
        observation = "Open wound detected.";
        possibleCause = "Cut, scrape, or laceration.";
        whatToDo = "Clean wound, apply antiseptic, and cover with sterile dressing. Seek medical attention if deep or bleeding heavily.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, rashKeywords)) {
      logQuery(caller, #symptom, "Skin rash observed");
      return {
        observation = "Skin rash observed.";
        possibleCause = "Allergic reaction, infection, or skin irritation.";
        whatToDo = "Keep area clean, avoid scratching, and apply topical ointment. Consult doctor if rash persists or worsens.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, bruiseKeywords)) {
      logQuery(caller, #symptom, "Bruise identified");
      return {
        observation = "Bruise identified.";
        possibleCause = "Trauma or impact injury.";
        whatToDo = "Apply cold compress, rest, and elevate area if possible. Monitor for excessive swelling or pain.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, burnKeywords)) {
      logQuery(caller, #symptom, "Burn injury detected");
      return {
        observation = "Burn injury detected.";
        possibleCause = "Thermal, chemical, or electrical burn.";
        whatToDo = "Cool burn with water, avoid breaking blisters, and cover with sterile dressing. Seek medical attention if severe.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, swellingKeywords)) {
      logQuery(caller, #symptom, "Swelling observed");
      return {
        observation = "Swelling observed.";
        possibleCause = "Injury, infection, or allergic reaction.";
        whatToDo = "Rest and elevate affected area. Apply ice or cold compress. Consult doctor if severe or persistent.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, acneKeywords)) {
      logQuery(caller, #symptom, "Acne/pimples detected");
      return {
        observation = "Acne/pimples detected.";
        possibleCause = "Clogged pores, hormonal changes, or bacterial infection.";
        whatToDo = "Clean area gently with mild cleanser. Avoid picking or squeezing. Use topical acne medication if available.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, blisterKeywords)) {
      logQuery(caller, #symptom, "Blister formed");
      return {
        observation = "Blister formed.";
        possibleCause = "Friction, burn, or infection.";
        whatToDo = "Keep blister clean and dry. Avoid popping unless necessary. Cover with protective bandage if needed.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, insectBiteKeywords)) {
      logQuery(caller, #symptom, "Insect bite/sting identified");
      return {
        observation = "Insect bite/sting identified.";
        possibleCause = "Mosquito, spider, bee, or other insect.";
        whatToDo = "Clean area with soap and water. Apply ice or cold compress to reduce swelling. Use antihistamine cream if itchy.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    logQuery(caller, #symptom, "Unclear description, unable to determine condition");
    {
      observation = "Insufficient description provided.";
      possibleCause = "Unable to determine specific condition.";
      whatToDo = "Please provide more detailed description or consult a healthcare professional.";
      disclaimer = "This analysis is not a substitute for professional medical advice.";
    };
  };

  public query ({ caller }) func getMedicalAdvice(symptoms : Text) : async MedicalAdvice {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get medical advice");
    };
    
    let text = symptoms.toLower();

    let headacheKeywords = ["headache", "migraine", "head pain"];
    let feverKeywords = ["fever", "high temperature", "chills"];
    let coughKeywords = ["cough", "throat", "respiratory"];
    let stomachKeywords = ["stomach", "abdominal", "belly pain"];
    let backPainKeywords = ["back pain", "lumbar", "spine"];
    let nauseaKeywords = ["nausea", "vomiting", "sick to stomach"];
    let dizzinessKeywords = ["dizzy", "vertigo", "lightheaded"];
    let soreThroatKeywords = ["sore throat", "throat pain"];
    let coldFluKeywords = ["cold", "flu", "runny nose"];
    let chestPainKeywords = ["chest pain", "tightness"];
    let itchingKeywords = ["itching", "skin irritation"];
    let eyePainKeywords = ["eye pain", "redness"];
    let jointPainKeywords = ["joint pain", "arthritis"];
    let fatigueKeywords = ["fatigue", "tiredness", "weakness"];

    if (containsKeyword(text, headacheKeywords)) {
      logQuery(caller, #advice, "Headache advice provided");
      return {
        possibleReasons = "Tension, dehydration, sinus issues, migraines";
        generalAdvice = "Rest in a quiet, dark room, stay hydrated, and consider taking over-the-counter pain relievers if needed. Seek medical attention for severe or persistent headaches.";
        homeCareTips = [
          "Apply cold compress to forehead",
          "Practice relaxation techniques",
          "Avoid triggers like bright lights or loud noises",
        ];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, feverKeywords)) {
      logQuery(caller, #advice, "Fever advice provided");
      return {
        possibleReasons = "Infection, inflammation, heat exhaustion";
        generalAdvice = "Stay hydrated, rest, and monitor temperature regularly. Use fever-reducing medications if uncomfortable. Seek medical attention for persistent high fever, especially in children or elderly individuals.";
        homeCareTips = [
          "Drink plenty of fluids",
          "Wear light, comfortable clothing",
          "Use cool compresses",
        ];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, coughKeywords)) {
      logQuery(caller, #advice, "Cough advice provided");
      return {
        possibleReasons = "Viral or bacterial infection, allergies, irritants";
        generalAdvice = "Stay hydrated, use cough syrup or lozenges for relief, and avoid smoking or exposure to irritants. Consult doctor if cough persists or worsens.";
        homeCareTips = [
          "Drink warm liquids",
          "Use humidifier to moisten air",
          "Rest and avoid strenuous activity",
        ];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, stomachKeywords)) {
      logQuery(caller, #advice, "Stomach pain advice provided");
      return {
        possibleReasons = "Indigestion, viral infection, food poisoning";
        generalAdvice = "Avoid heavy meals, stay hydrated, and monitor for dehydration. Seek medical attention for persistent vomiting, diarrhea, or severe abdominal pain.";
        homeCareTips = [
          "Eat bland foods like rice or bananas",
          "Avoid spicy or greasy foods",
          "Rest and drink clear fluids",
        ];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, backPainKeywords)) {
      logQuery(caller, #advice, "Back pain advice provided");
      return {
        possibleReasons = "Muscle strain, poor posture, injury";
        generalAdvice = "Apply heat or cold packs, avoid heavy lifting, and practice stretching exercises. Consult doctor for persistent or severe back pain.";
        homeCareTips = [
          "Maintain good posture",
          "Use supportive mattress",
          "Exercise regularly to strengthen back muscles",
        ];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, nauseaKeywords)) {
      logQuery(caller, #advice, "Nausea/vomiting advice provided");
      return {
        possibleReasons = "Food poisoning, viral infection, motion sickness";
        generalAdvice = "Avoid solid foods, sip clear fluids frequently, and rest. Seek medical attention for persistent vomiting or dehydration.";
        homeCareTips = ["Drink ginger tea", "Eat small, frequent meals", "Avoid strong odors and spicy foods"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, dizzinessKeywords)) {
      logQuery(caller, #advice, "Dizziness/vertigo advice provided");
      return {
        possibleReasons = "Dehydration, low blood pressure, inner ear issues";
        generalAdvice = "Sit or lie down immediately, drink fluids, and avoid sudden movements. Seek medical attention for persistent or severe dizziness.";
        homeCareTips = ["Avoid standing up too quickly", "Stay hydrated", "Eat regular meals"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, soreThroatKeywords)) {
      logQuery(caller, #advice, "Sore throat advice provided");
      return {
        possibleReasons = "Viral or bacterial infection, allergies, irritants";
        generalAdvice = "Drink warm liquids, use throat lozenges, and avoid irritants. Consult doctor if sore throat persists or worsens.";
        homeCareTips = ["Gargle with salt water", "Drink warm tea with honey", "Use humidifier in bedroom"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, coldFluKeywords)) {
      logQuery(caller, #advice, "Cold/flu advice provided");
      return {
        possibleReasons = "Viral infection, seasonal allergies";
        generalAdvice = "Rest, stay hydrated, and monitor symptoms closely. Use over-the-counter medications if needed. Seek medical attention for persistent or severe symptoms.";
        homeCareTips = [
          "Drink plenty of fluids",
          "Use saline nasal spray",
          "Avoid strenuous activity until recovered",
        ];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, chestPainKeywords)) {
      logQuery(caller, #advice, "Chest pain advice provided");
      return {
        possibleReasons = "Muscle strain, heart issues, respiratory infection";
        generalAdvice = "Chest pain can be serious. Seek immediate medical attention if pain is severe, persistent, or accompanied by shortness of breath, sweating, or nausea.";
        homeCareTips = ["Rest and avoid strenuous activity", "Monitor blood pressure regularly", "Use heating pad for muscle pain"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, itchingKeywords)) {
      logQuery(caller, #advice, "Itching/skin irritation advice provided");
      return {
        possibleReasons = "Allergic reaction, dry skin, insect bites";
        generalAdvice = "Keep affected area clean and dry, avoid scratching, and use anti-itch creams. Seek medical attention for persistent or severe symptoms.";
        homeCareTips = ["Apply calamine lotion", "Use mild, unscented soaps", "Keep nails trimmed to prevent scratching"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, eyePainKeywords)) {
      logQuery(caller, #advice, "Eye pain/redness advice provided");
      return {
        possibleReasons = "Allergies, infection, eye strain";
        generalAdvice = "Avoid rubbing eyes, use anti-inflammatory eye drops, and rest eyes frequently. Seek medical attention for persistent or severe pain.";
        homeCareTips = ["Use cold compress on eyes", "Avoid prolonged screen time", "Wear sunglasses outdoors"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, jointPainKeywords)) {
      logQuery(caller, #advice, "Joint pain/arthritis advice provided");
      return {
        possibleReasons = "Arthritis, injury, overuse";
        generalAdvice = "Apply heat or cold packs, rest affected joints, and avoid strenuous activity. Consult doctor for persistent or severe joint pain.";
        homeCareTips = [
          "Do gentle stretching exercises",
          "Use supportive footwear",
          "Maintain healthy weight to reduce joint stress",
        ];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, fatigueKeywords)) {
      logQuery(caller, #advice, "Fatigue/tiredness/weakness advice provided");
      return {
        possibleReasons = "Lack of sleep, dehydration, infection, stress";
        generalAdvice = "Get plenty of rest, stay hydrated, and eat nutritious meals. Consult doctor for persistent or severe fatigue.";
        homeCareTips = [
          "Take short naps if needed",
          "Engage in light physical activity",
          "Practice stress management techniques",
        ];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    logQuery(caller, #advice, "Generic advice for unspecified symptoms");
    {
      possibleReasons = "Unable to determine specific condition";
      generalAdvice = "Monitor symptoms closely and seek medical attention if condition worsens.";
      homeCareTips = ["Rest as needed", "Stay hydrated"];
      disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
    };
  };
};
