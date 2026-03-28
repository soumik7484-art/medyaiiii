import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";



actor {
  type QueryType = { #prescription; #symptom; #advice };

  type QueryLog = {
    id : Nat;
    queryType : QueryType;
    timestamp : Int;
    summary : Text;
  };

  var nextId = 1;

  let queries = List.empty<QueryLog>();

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

  func logQuery(queryType : QueryType, summary : Text) {
    let queryLog = {
      id = nextId;
      queryType;
      timestamp = getCurrentTime();
      summary;
    };
    queries.add(queryLog);
    nextId += 1;
  };

  func getQueryById(id : Nat) : ?QueryLog {
    queries.toArray().find(func(logEntry) { logEntry.id == id });
  };

  public query ({ caller }) func getQuery(id : Nat) : async QueryLog {
    switch (getQueryById(id)) {
      case (null) { Runtime.trap("Query log not found") };
      case (?logEntry) { logEntry };
    };
  };

  public query ({ caller }) func getAllQueries() : async [QueryLog] {
    queries.toArray();
  };

  public query ({ caller }) func getRecentQueries() : async [QueryLog] {
    let sortedQueries = queries.toArray().sort(
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
      logQuery(#prescription, "Amoxicillin - 500mg, confident match");
      return {
        medicineName = "Amoxicillin";
        dosage = "500mg";
        frequency = "3 times a day";
        confidenceLevel = "High";
        notes = "Common antibiotic prescription.";
      };
    };

    if (containsKeyword(text, ibuprofenKeywords)) {
      logQuery(#prescription, "Ibuprofen - 400mg, confident match");
      return {
        medicineName = "Ibuprofen";
        dosage = "400mg";
        frequency = "Every 6-8 hours as needed";
        confidenceLevel = "High";
        notes = "Common pain reliever and anti-inflammatory medication.";
      };
    };

    if (containsKeyword(text, paracetamolKeywords)) {
      logQuery(#prescription, "Paracetamol - 500mg, confident match");
      return {
        medicineName = "Paracetamol (Acetaminophen)";
        dosage = "500mg";
        frequency = "Every 4-6 hours as needed";
        confidenceLevel = "High";
        notes = "Common pain reliever and fever reducer.";
      };
    };

    if (containsKeyword(text, lipitorKeywords)) {
      logQuery(#prescription, "Lipitor - 20mg, moderate confidence");
      return {
        medicineName = "Lipitor (Atorvastatin)";
        dosage = "20mg";
        frequency = "Once daily";
        confidenceLevel = "Medium";
        notes = "Cholesterol-lowering medication.";
      };
    };

    if (containsKeyword(text, metforminKeywords)) {
      logQuery(#prescription, "Metformin - 500mg, moderate confidence");
      return {
        medicineName = "Metformin (Glucophage)";
        dosage = "500mg";
        frequency = "2 times a day";
        confidenceLevel = "Medium";
        notes = "Diabetes medication to control blood sugar levels.";
      };
    };

    if (containsKeyword(text, cetirizineKeywords)) {
      logQuery(#prescription, "Cetirizine - 10mg, moderate confidence");
      return {
        medicineName = "Cetirizine (Zyrtec)";
        dosage = "10mg";
        frequency = "Once daily as needed";
        confidenceLevel = "Medium";
        notes = "Allergy medication.";
      };
    };

    if (containsKeyword(text, omeprazoleKeywords)) {
      logQuery(#prescription, "Omeprazole - 20mg, moderate confidence");
      return {
        medicineName = "Omeprazole (Prilosec)";
        dosage = "20mg";
        frequency = "Once daily before meals";
        confidenceLevel = "Medium";
        notes = "Stomach acid reducer.";
      };
    };

    if (containsKeyword(text, azithromycinKeywords)) {
      logQuery(#prescription, "Azithromycin - 500mg, moderate confidence");
      return {
        medicineName = "Azithromycin";
        dosage = "500mg";
        frequency = "Once daily for 3-5 days";
        confidenceLevel = "Medium";
        notes = "Antibiotic used to treat infections.";
      };
    };

    if (containsKeyword(text, pantoprazoleKeywords)) {
      logQuery(#prescription, "Pantoprazole - 40mg, moderate confidence");
      return {
        medicineName = "Pantoprazole (Protonix)";
        dosage = "40mg";
        frequency = "Once daily before meals";
        confidenceLevel = "Medium";
        notes = "Stomach acid reducer.";
      };
    };

    if (containsKeyword(text, aspirinKeywords)) {
      logQuery(#prescription, "Aspirin - 81mg, moderate confidence");
      return {
        medicineName = "Aspirin";
        dosage = "81mg";
        frequency = "Once daily for heart health";
        confidenceLevel = "Medium";
        notes = "Blood thinner and pain reliever.";
      };
    };

    if (containsKeyword(text, ciprofloxacinKeywords)) {
      logQuery(#prescription, "Ciprofloxacin - 500mg, moderate confidence");
      return {
        medicineName = "Ciprofloxacin (Cipro)";
        dosage = "500mg";
        frequency = "2 times a day";
        confidenceLevel = "Medium";
        notes = "Antibiotic for bacterial infections.";
      };
    };

    if (containsKeyword(text, doxycyclineKeywords)) {
      logQuery(#prescription, "Doxycycline - 100mg, moderate confidence");
      return {
        medicineName = "Doxycycline (Doxy)";
        dosage = "100mg";
        frequency = "2 times a day";
        confidenceLevel = "Medium";
        notes = "Antibiotic for infections.";
      };
    };

    logQuery(#prescription, "Unidentified prescription, low confidence");
    {
      medicineName = "Unable to confidently identify";
      dosage = "N/A";
      frequency = "N/A";
      confidenceLevel = "Low";
      notes = "Prescription text unclear or unrecognized. Please clarify the medication name or consult a pharmacist.";
    };
  };

  public query ({ caller }) func analyzeSymptomImage(imageDescription : Text) : async ImageAnalysis {
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
      logQuery(#symptom, "Scar tissue identified");
      return {
        observation = "Scar tissue identified.";
        possibleCause = "Previous injury or surgery.";
        whatToDo = "Monitor for changes in appearance. Consult dermatologist if concerned.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, woundKeywords)) {
      logQuery(#symptom, "Open wound detected");
      return {
        observation = "Open wound detected.";
        possibleCause = "Cut, scrape, or laceration.";
        whatToDo = "Clean wound, apply antiseptic, and cover with sterile dressing. Seek medical attention if deep or bleeding heavily.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, rashKeywords)) {
      logQuery(#symptom, "Skin rash observed");
      return {
        observation = "Skin rash observed.";
        possibleCause = "Allergic reaction, infection, or skin irritation.";
        whatToDo = "Keep area clean, avoid scratching, and apply topical ointment. Consult doctor if rash persists or worsens.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, bruiseKeywords)) {
      logQuery(#symptom, "Bruise identified");
      return {
        observation = "Bruise identified.";
        possibleCause = "Trauma or impact injury.";
        whatToDo = "Apply cold compress, rest, and elevate area if possible. Monitor for excessive swelling or pain.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, burnKeywords)) {
      logQuery(#symptom, "Burn injury detected");
      return {
        observation = "Burn injury detected.";
        possibleCause = "Thermal, chemical, or electrical burn.";
        whatToDo = "Cool burn with water, avoid breaking blisters, and cover with sterile dressing. Seek medical attention if severe.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, swellingKeywords)) {
      logQuery(#symptom, "Swelling observed");
      return {
        observation = "Swelling observed.";
        possibleCause = "Injury, infection, or allergic reaction.";
        whatToDo = "Rest and elevate affected area. Apply ice or cold compress. Consult doctor if severe or persistent.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, acneKeywords)) {
      logQuery(#symptom, "Acne/pimples detected");
      return {
        observation = "Acne/pimples detected.";
        possibleCause = "Clogged pores, hormonal changes, or bacterial infection.";
        whatToDo = "Clean area gently with mild cleanser. Avoid picking or squeezing. Use topical acne medication if available.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, blisterKeywords)) {
      logQuery(#symptom, "Blister formed");
      return {
        observation = "Blister formed.";
        possibleCause = "Friction, burn, or infection.";
        whatToDo = "Keep blister clean and dry. Avoid popping unless necessary. Cover with protective bandage if needed.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    if (containsKeyword(text, insectBiteKeywords)) {
      logQuery(#symptom, "Insect bite/sting identified");
      return {
        observation = "Insect bite/sting identified.";
        possibleCause = "Mosquito, spider, bee, or other insect.";
        whatToDo = "Clean area with soap and water. Apply ice or cold compress to reduce swelling. Use antihistamine cream if itchy.";
        disclaimer = "This analysis is not a substitute for professional medical advice.";
      };
    };

    logQuery(#symptom, "Unclear description, unable to determine condition");
    {
      observation = "Insufficient description provided.";
      possibleCause = "Unable to determine specific condition.";
      whatToDo = "Please provide more detailed description or consult a healthcare professional.";
      disclaimer = "This analysis is not a substitute for professional medical advice.";
    };
  };

  public query ({ caller }) func getMedicalAdvice(symptoms : Text) : async MedicalAdvice {
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
      logQuery(#advice, "Headache advice provided");
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
      logQuery(#advice, "Fever advice provided");
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
      logQuery(#advice, "Cough advice provided");
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
      logQuery(#advice, "Stomach pain advice provided");
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
      logQuery(#advice, "Back pain advice provided");
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
      logQuery(#advice, "Nausea/vomiting advice provided");
      return {
        possibleReasons = "Food poisoning, viral infection, motion sickness";
        generalAdvice = "Avoid solid foods, sip clear fluids frequently, and rest. Seek medical attention for persistent vomiting or dehydration.";
        homeCareTips = ["Drink ginger tea", "Eat small, frequent meals", "Avoid strong odors and spicy foods"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, dizzinessKeywords)) {
      logQuery(#advice, "Dizziness/vertigo advice provided");
      return {
        possibleReasons = "Dehydration, low blood pressure, inner ear issues";
        generalAdvice = "Sit or lie down immediately, drink fluids, and avoid sudden movements. Seek medical attention for persistent or severe dizziness.";
        homeCareTips = ["Avoid standing up too quickly", "Stay hydrated", "Eat regular meals"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, soreThroatKeywords)) {
      logQuery(#advice, "Sore throat advice provided");
      return {
        possibleReasons = "Viral or bacterial infection, allergies, irritants";
        generalAdvice = "Drink warm liquids, use throat lozenges, and avoid irritants. Consult doctor if sore throat persists or worsens.";
        homeCareTips = ["Gargle with salt water", "Drink warm tea with honey", "Use humidifier in bedroom"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, coldFluKeywords)) {
      logQuery(#advice, "Cold/flu advice provided");
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
      logQuery(#advice, "Chest pain advice provided");
      return {
        possibleReasons = "Muscle strain, heart issues, respiratory infection";
        generalAdvice = "Chest pain can be serious. Seek immediate medical attention if pain is severe, persistent, or accompanied by shortness of breath, sweating, or nausea.";
        homeCareTips = ["Rest and avoid strenuous activity", "Monitor blood pressure regularly", "Use heating pad for muscle pain"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, itchingKeywords)) {
      logQuery(#advice, "Itching/skin irritation advice provided");
      return {
        possibleReasons = "Allergic reaction, dry skin, insect bites";
        generalAdvice = "Keep affected area clean and dry, avoid scratching, and use anti-itch creams. Seek medical attention for persistent or severe symptoms.";
        homeCareTips = ["Apply calamine lotion", "Use mild, unscented soaps", "Keep nails trimmed to prevent scratching"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, eyePainKeywords)) {
      logQuery(#advice, "Eye pain/redness advice provided");
      return {
        possibleReasons = "Allergies, infection, eye strain";
        generalAdvice = "Avoid rubbing eyes, use anti-inflammatory eye drops, and rest eyes frequently. Seek medical attention for persistent or severe pain.";
        homeCareTips = ["Use cold compress on eyes", "Avoid prolonged screen time", "Wear sunglasses outdoors"];
        disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
      };
    };

    if (containsKeyword(text, jointPainKeywords)) {
      logQuery(#advice, "Joint pain/arthritis advice provided");
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
      logQuery(#advice, "Fatigue/tiredness/weakness advice provided");
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

    logQuery(#advice, "Generic advice for unspecified symptoms");
    {
      possibleReasons = "Unable to determine specific condition";
      generalAdvice = "Monitor symptoms closely and seek medical attention if condition worsens.";
      homeCareTips = ["Rest as needed", "Stay hydrated"];
      disclaimer = "This advice is for informational purposes only and should not replace professional medical care.";
    };
  };
};
