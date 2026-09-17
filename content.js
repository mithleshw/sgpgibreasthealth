/* =========================================================================
   PINK WAVE 2026  ·  content spine
   -------------------------------------------------------------------------
   Every clinical line below is taken from SGPGI's own published material:
     • "Your Guide to Early Detection of Breast Cancer" (English + Hindi)
     • sgpgibreasthealth.org.in  →  Myths & Facts
   Where an official Hindi sentence exists, it is used verbatim.

   THIS IS THE FILE A FACULTY MEMBER REVIEWS AND SIGNS OFF.
   Sources are noted in comments. Nothing here is invented.
   ========================================================================= */

const C = {};

/* ---------------------------------------------------------------- UI ---- */
C.ui = {
  appName:      {en:"Pink Wave 2026",           hi:"पिंक वेव 2026"},
  tagline:      {en:"Are you breast aware?",    hi:"क्या आप स्तन जागरूक हैं?"},
  hostedBy:     {en:"SGPGI Breast Health Program · Lucknow",
                 hi:"एसजीपीजीआई ब्रेस्ट हेल्थ प्रोग्राम · लखनऊ"},
  start:        {en:"Start",                    hi:"शुरू करें"},
  next:         {en:"Next",                     hi:"आगे"},
  prev:         {en:"Back",                     hi:"पीछे"},
  back:         {en:"Back",                     hi:"वापस"},
  gotIt:        {en:"Got it",                   hi:"समझ गई"},
  continue:     {en:"Continue",                 hi:"आगे बढ़ें"},
  skip:         {en:"Skip",                     hi:"छोड़ें"},
  menu:         {en:"Jump to a section",        hi:"किसी भाग पर जाएँ"},

  introLead:    {en:"Three short games. Six minutes. Everything here comes from the SGPGI Breast Health Program's own guide.",
                 hi:"तीन छोटे खेल। छह मिनट। यहाँ सब कुछ एसजीपीजीआई ब्रेस्ट हेल्थ प्रोग्राम की अपनी पुस्तिका से है।"},

  m1Title:      {en:"Myth or Fact?",            hi:"मिथक या सच?"},
  m1Sub:        {en:"14 things people believe about breast cancer",
                 hi:"स्तन कैंसर के बारे में 14 आम धारणाएँ"},
  m2Title:      {en:"Spot the Sign",            hi:"लक्षण पहचानिए"},
  m2Sub:        {en:"Tap what looks wrong",     hi:"जो असामान्य लगे उस पर टैप कीजिए"},
  m3Title:      {en:"Self-Examination",         hi:"स्वयं जाँच"},
  m3Sub:        {en:"The 7 steps, from the brochure",
                 hi:"पुस्तिका के अनुसार 7 चरण"},

  myth:         {en:"MYTH",                     hi:"मिथक"},
  mythSub:      {en:"Not true",                 hi:"सच नहीं"},
  fact:         {en:"FACT",                     hi:"सच"},
  factSub:      {en:"True",                     hi:"सही"},
  correct:      {en:"Correct",                  hi:"सही"},
  wrong:        {en:"Not quite",                hi:"ऐसा नहीं है"},
  swipeHint:    {en:"Tap an answer, or swipe the card left for Myth, right for Fact.",
                 hi:"उत्तर चुनिए, या कार्ड बाएँ (मिथक) / दाएँ (सच) खिसकाइए।"},

  tapPrompt:    {en:"Tap what looks abnormal",  hi:"जो असामान्य दिखे उस पर टैप कीजिए"},
  nothingWrong: {en:"Nothing looks wrong",      hi:"कुछ भी असामान्य नहीं"},
  goodSpot:     {en:"Good spot!",               hi:"बिलकुल सही!"},
  missed:       {en:"Here it is",               hi:"यह रहा"},
  rightNormal:  {en:"Right — this one is normal.", hi:"सही — यह सामान्य है।"},
  wasNormal:    {en:"This one was actually normal.", hi:"यह वास्तव में सामान्य था।"},

  bestTime:     {en:"When to do it",            hi:"कब करें"},
  pickPattern:  {en:"Choose how you will feel the breast",
                 hi:"स्तन को महसूस करने का तरीक़ा चुनिए"},
  patternNote:  {en:"None is better than the other. Doing the same one every month is what matters.",
                 hi:"कोई भी तरीक़ा दूसरे से बेहतर नहीं। हर महीने एक ही तरीक़ा अपनाना ज़रूरी है।"},

  scoreLabel:   {en:"Your score",               hi:"आपका स्कोर"},
  mythsLabel:   {en:"Myths",                    hi:"मिथक"},
  signsLabel:   {en:"Signs",                    hi:"लक्षण"},
  stepsLabel:   {en:"Steps",                    hi:"चरण"},
  unlocked:     {en:"Pink Pledge unlocked",     hi:"पिंक प्रतिज्ञा अनलॉक"},

  pledgeTitle:  {en:"Take the Pink Pledge",     hi:"पिंक प्रतिज्ञा लीजिए"},
  pledgeSub:    {en:"Put your name on it and pass the wave on.",
                 hi:"अपना नाम लिखिए और लहर आगे बढ़ाइए।"},
  yourName:     {en:"Your name",                hi:"आपका नाम"},
  makeCard:     {en:"Make my certificate",      hi:"मेरा प्रमाणपत्र बनाइए"},
  shareWA:      {en:"Share on WhatsApp",        hi:"WhatsApp पर साझा करें"},
  download:     {en:"Save image",               hi:"चित्र सहेजें"},
  playAgain:    {en:"Play again",               hi:"फिर से खेलें"},

  videoChip:    {en:"Hear it from the doctor",  hi:"डॉक्टर से सुनिए"},
  videoOffline: {en:"Video needs internet — the full answer is written above.",
                 hi:"वीडियो के लिए इंटरनेट चाहिए — पूरा उत्तर ऊपर लिखा है।"},
  watchAll:     {en:"Watch the full series",    hi:"पूरी श्रृंखला देखिए"},

  brochureTitle:{en:"Download the full brochure",hi:"पूरी पुस्तिका डाउनलोड कीजिए"},
  brochureSub:  {en:"The complete SGPGI guide to early detection, as a PDF.",
                 hi:"जल्दी पहचान पर एसजीपीजीआई की पूरी पुस्तिका, पीडीएफ़ में।"},
  fldName:      {en:"Name",                     hi:"नाम"},
  fldCity:      {en:"City",                     hi:"शहर"},
  fldRole:      {en:"I am a",                   hi:"मैं हूँ"},
  getPdfEn:     {en:"Download (English)",       hi:"डाउनलोड करें (अंग्रेज़ी)"},
  getPdfHi:     {en:"Download (Hindi)",         hi:"डाउनलोड करें (हिंदी)"},

  seeDoctor:    {en:"Talk to a doctor",         hi:"डॉक्टर से मिलिए"},
  eventTitle:   {en:"Pink Wave 2026 Walkathon", hi:"पिंक वेव 2026 वॉकाथॉन"},
  register:     {en:"Register for the Walk",    hi:"वॉक के लिए पंजीकरण करें"},
  invite:       {en:"Invite friends",           hi:"दोस्तों को बुलाएँ"},

  disclaimer:   {en:"For awareness and education only. This is not a diagnosis and does not replace examination by a doctor. If you notice any change in your breast, see a doctor — do not wait.",
                 hi:"यह केवल जागरूकता एवं शिक्षा के लिए है। यह निदान नहीं है और डॉक्टर की जाँच का विकल्प नहीं है। स्तन में कोई भी बदलाव दिखे तो डॉक्टर को दिखाइए — प्रतीक्षा न करें।"},
  credit:       {en:"Made by drmithleshw using Claude AI",
                 hi:"drmithleshw द्वारा Claude AI से निर्मित"}
};

/* ------------------------------------------------------------- MYTHS ----
   Source: sgpgibreasthealth.org.in → Myths & Facts ("What Science Says").
   The site lists 13 statements, all of which are myths. A deck where every
   answer is MYTH is unplayable, so six FACT statements were derived from the
   same "What Science Says" text (marked ► below). No new claims were added.
   ------------------------------------------------------------------------ */
C.myths = [
 { id:"m01", a:"myth",
   q:{en:"Breasts are mainly sexual organs.",
      hi:"स्तन मुख्य रूप से यौन अंग हैं।"},
   e:{en:"Breasts are modified sweat glands lying over the chest wall on both sides. Loss of a breast, or a change in its size, does not affect sexual performance or fertility.",
      hi:"स्तन वास्तव में परिवर्तित स्वेद ग्रंथियाँ हैं जो छाती की दीवार पर दोनों ओर स्थित होती हैं। स्तन का न रहना या उसके आकार में बदलाव यौन क्षमता या प्रजनन क्षमता को प्रभावित नहीं करता।"} },

 { id:"m02", a:"myth",
   q:{en:"Breast cancer can spread from one person to another.",
      hi:"स्तन कैंसर एक व्यक्ति से दूसरे में फैल सकता है।"},
   e:{en:"Breast cancer is caused by alteration and excess division of cells within the breast. It is not communicable like an infection.",
      hi:"स्तन कैंसर स्तन के भीतर कोशिकाओं में बदलाव और अत्यधिक विभाजन से होता है। यह संक्रमण की तरह एक से दूसरे में नहीं फैलता।"} },

 { id:"m03", a:"myth",
   q:{en:"Getting examined, or having a mammogram, harms a woman's sexual life.",
      hi:"जाँच कराने या मैमोग्राफ़ी कराने से महिला का यौन जीवन ख़राब होता है।"},
   e:{en:"None of these — self-examination, clinical examination, mammography, FNAC, radiation, mastectomy or reconstruction — affects sexual function, because breasts are not primary sex organs. All of them help towards early treatment and a long life.",
      hi:"इनमें से कोई भी — स्वयं जाँच, चिकित्सकीय जाँच, मैमोग्राफ़ी, एफ़एनएसी, रेडिएशन, स्तन निकालना या पुनर्निर्माण — यौन क्रिया को प्रभावित नहीं करता, क्योंकि स्तन प्राथमिक यौन अंग नहीं हैं। ये सब जल्दी इलाज और लंबी आयु में मदद करते हैं।"} },

 { id:"m04", a:"myth",
   q:{en:"A woman gets breast cancer because of some sin or wrongdoing.",
      hi:"महिला को किसी पाप या ग़लती के कारण स्तन कैंसर होता है।"},
   e:{en:"Breast cancer can affect anyone, depending on environmental and genetic factors. It has nothing to do with a person's character or social behaviour.",
      hi:"स्तन कैंसर किसी को भी हो सकता है, यह पर्यावरणीय और आनुवंशिक कारणों पर निर्भर करता है। इसका व्यक्ति के चरित्र या आचरण से कोई संबंध नहीं है।"} },

 { id:"m05", a:"myth",
   q:{en:"Breast pain usually means cancer.",
      hi:"स्तन में दर्द का मतलब आमतौर पर कैंसर होता है।"},
   e:{en:"In 90% of cases breast cancer is painless, and breast pain usually points to benign disease. Before menopause most breast pain is hormonal; after menopause it is usually musculoskeletal. When cancer does cause pain, it appears only very late.",
      hi:"90% मामलों में स्तन कैंसर दर्दरहित होता है, और स्तन दर्द प्रायः सामान्य (कैंसर-रहित) बीमारी का संकेत है। रजोनिवृत्ति से पहले अधिकतर दर्द हार्मोन के कारण होता है; बाद में हड्डी-मांसपेशी के कारण। कैंसर में दर्द बहुत देर से आता है।"} },

 { id:"m06", a:"myth",
   q:{en:"Only women with large breasts get breast cancer.",
      hi:"केवल बड़े स्तन वाली महिलाओं को स्तन कैंसर होता है।"},
   e:{en:"Large or small, the size of the breast does not determine the risk of getting breast cancer. It depends far more on internal activity and external factors.",
      hi:"बड़ा हो या छोटा, स्तन का आकार कैंसर के ख़तरे को तय नहीं करता। यह भीतरी गतिविधि और बाहरी कारणों पर कहीं अधिक निर्भर है।"} },

 { id:"m07", a:"myth",
   q:{en:"A normal mammogram means there is definitely no cancer.",
      hi:"मैमोग्राफ़ी सामान्य आने का मतलब है कि कैंसर निश्चित रूप से नहीं है।"},
   e:{en:"About 80–85% of breast cancers can be detected on mammography. A negative mammogram does not rule out cancer — if something is felt or seen, it must still be investigated or followed up.",
      hi:"लगभग 80–85% स्तन कैंसर मैमोग्राफ़ी में पकड़ में आते हैं। सामान्य मैमोग्राफ़ी कैंसर को पूरी तरह ख़ारिज नहीं करती — कुछ महसूस या दिख रहा हो तो आगे जाँच या निगरानी ज़रूरी है।"} },

 { id:"m08", a:"myth",
   q:{en:"Breastfeeding spoils the shape of the breast forever.",
      hi:"स्तनपान कराने से स्तन का आकार हमेशा के लिए ख़राब हो जाता है।"},
   e:{en:"There is no loss of the normal form and function of the breast after breastfeeding. Breastfeeding is best for both mother and infant — human milk is nutritionally and immunologically superior and cannot be matched by any other feed.",
      hi:"स्तनपान के बाद स्तन के सामान्य रूप और कार्य में कोई हानि नहीं होती। स्तनपान माँ और शिशु दोनों के लिए सर्वोत्तम है — माँ का दूध पोषण और रोग-प्रतिरोधक क्षमता में श्रेष्ठ है और उसकी बराबरी कोई दूसरा आहार नहीं कर सकता।"} },

 /* ► derived FACT statements, same source text */
 { id:"m09", a:"fact",
   q:{en:"In more than 8 out of 10 breast cancers, there is no family history and no identifiable cause.",
      hi:"10 में से 8 से अधिक स्तन कैंसर में परिवार में कोई इतिहास नहीं होता और कोई कारण पहचान में नहीं आता।"},
   e:{en:"True. In over 80% of breast cancer cases there are no identifiable risk factors — they are sporadic. A clean family history is not protection. Every woman needs to stay breast aware.",
      hi:"सही। 80% से अधिक मामलों में कोई पहचाने जाने योग्य जोखिम कारक नहीं होता — ये अपने आप होते हैं। परिवार में इतिहास न होना सुरक्षा नहीं है। हर महिला को जागरूक रहना चाहिए।"} },

 { id:"m10", a:"fact",
   q:{en:"In 9 out of 10 cases, breast cancer causes no pain at all.",
      hi:"10 में से 9 मामलों में स्तन कैंसर में बिलकुल दर्द नहीं होता।"},
   e:{en:"True — and this is why waiting for pain is dangerous. In 90% of cases breast cancer is painless. A lump that does not hurt still needs a doctor.",
      hi:"सही — और इसीलिए दर्द का इंतज़ार करना ख़तरनाक है। 90% मामलों में स्तन कैंसर दर्दरहित होता है। बिना दर्द वाली गाँठ भी डॉक्टर को दिखानी चाहिए।"} },

 { id:"m11", a:"fact",
   q:{en:"Most breast lumps — 75 to 85 in every 100 — are not cancer.",
      hi:"अधिकतर स्तन गाँठें — हर 100 में 75 से 85 — कैंसर नहीं होतीं।"},
   e:{en:"True. In younger women 75–85% of breast lumps are due to benign disease; the risk rises with age. But no one can tell by feel alone, so every new lump still needs a doctor's examination.",
      hi:"सही। कम उम्र की महिलाओं में 75–85% गाँठें सामान्य (कैंसर-रहित) बीमारी से होती हैं; उम्र के साथ ख़तरा बढ़ता है। पर सिर्फ़ छूकर कोई नहीं बता सकता, इसलिए हर नई गाँठ की डॉक्टरी जाँच ज़रूरी है।"} },

 { id:"m12", a:"fact",
   q:{en:"Breastfeeding reduces a woman's risk of breast cancer.",
      hi:"स्तनपान कराने से महिला में स्तन कैंसर का ख़तरा कम होता है।"},
   e:{en:"True. Breastfeeding helps in fertility control by delaying the return of menses, and in doing so it reduces the risk of breast cancer.",
      hi:"सही। स्तनपान माहवारी को देर से लौटाकर प्रजनन नियंत्रण में मदद करता है, और इस तरह स्तन कैंसर का ख़तरा कम करता है।"} },

 { id:"m13", a:"fact",
   q:{en:"A woman treated for breast cancer can have a baby afterwards.",
      hi:"स्तन कैंसर का इलाज करा चुकी महिला बाद में माँ बन सकती है।"},
   e:{en:"True. Women are advised not to become pregnant for about one year after treatment, because of the effects of the drugs and radiation. After that there is no restriction on pregnancy — even if both breasts have been removed.",
      hi:"सही। इलाज के बाद लगभग एक वर्ष तक गर्भधारण न करने की सलाह दी जाती है, क्योंकि दवाओं और रेडिएशन का असर रहता है। उसके बाद गर्भधारण पर कोई रोक नहीं — चाहे दोनों स्तन निकाले गए हों।"} },

 { id:"m14", a:"fact",
   q:{en:"Breast cancer can be present with no lump at all.",
      hi:"स्तन कैंसर बिना किसी गाँठ के भी हो सकता है।"},
   e:{en:"True. A lump is not the only presentation. It may show as a lump in the armpit, a change in the size or shape of the breast, dimpling or puckering, hardening of the skin, redness, nipple discharge or nipple retraction — or be found on investigation, with no symptoms at all.",
      hi:"सही। गाँठ ही एकमात्र लक्षण नहीं है। यह बग़ल में गाँठ, स्तन के आकार या रूप में बदलाव, त्वचा में गड्ढा या सिकुड़न, त्वचा का सख़्त होना, लालिमा, निप्पल से स्राव या निप्पल का अंदर धँसना — इनमें से किसी रूप में दिख सकता है, या बिना किसी लक्षण के जाँच में पकड़ में आ सकता है।"} }
];

/* ------------------------------------------------------- SELF-EXAM ------
   Source: brochure pages 2–4 (English) and pages 2–4 (Hindi), verbatim.
   photo = key into img/  ·  step 7 has no photograph in the brochure.
   ------------------------------------------------------------------------ */
C.steps = [
 { n:1, photo:"step1",
   h:{en:"Stand before a mirror",             hi:"दर्पण के सामने खड़ी हों"},
   p:{en:"Check each breast for anything different from the previous exam, such as any discharge from the nipples, puckering, dimpling, or scaling of the skin. Notice the normal size and shape of each breast — it is not unusual for one breast to be larger than the other — and the normal position of the nipple, making sure both your shoulders are at the same level.",
      hi:"प्रत्येक स्तन की जाँच करें कि वह पहले परीक्षण से कुछ भिन्न तो नहीं है — जैसे निप्पल से कुछ स्रावित होना, त्वचा में सिकुड़न, गड्ढा या पपड़ी। स्तन का सामान्य आकार देखिए; एक स्तन का दूसरे से बड़ा होना असामान्य नहीं है। निप्पल की सामान्य स्थिति देखिए और ध्यान रखिए कि दोनों कंधे एक ही सीध में हों।"} },

 { n:2, photo:"step2",
   h:{en:"Clasp your hands behind your head", hi:"दोनों हाथ सिर के पीछे रखिए"},
   p:{en:"Press them forward. You should feel your chest muscles tighten. Look in the mirror at the shape and contour of your breasts. Look for any swelling, dimpling, rash, discolouration, or other unusual changes in the skin. Slowly rotate your body from side to side to better view the size and shape of your breasts.",
      hi:"और आगे की ओर दबाइए। आप अनुभव करेंगी कि सीने की मांसपेशियाँ कड़ी हो गई हैं। दर्पण में अपने स्तन का आकार और रंग देखिए। देखिए कि उनमें सूजन, डिम्पलिंग (गड्ढे), चकत्ता, रंग का बदलना या कोई असामान्य परिवर्तन है या नहीं। धीरे-धीरे अपने शरीर को चारों ओर घुमाइए।"} },

 { n:3, photo:"step3",
   h:{en:"Press your hands firmly on your hips", hi:"दोनों हाथ मज़बूती से कमर पर रखिए"},
   p:{en:"Bend slightly toward your mirror as you pull your shoulders and elbows forward. Once again you should feel your chest muscles tighten. Look for any change in the shape or contour of your breasts, as well as any change in the nipples.",
      hi:"और दर्पण के आगे थोड़ा सा झुकिए, कंधे और कोहनियाँ आगे की ओर खींचते हुए। इस बार फिर सीने की मांसपेशियाँ कठोर हो जाएँगी। फिर अपने स्तन और निप्पल के आकार और रंग में किसी बदलाव को देखिए।"} },

 { n:4, photo:"step4",
   h:{en:"Gently squeeze each nipple",        hi:"प्रत्येक निप्पल को हल्के से दबाइए"},
   p:{en:"Look for a discharge. Begin at the outer edge of the areola, drawing your fingers towards the nipple. If there is any discharge, see your doctor — in fact, if you have a discharge at any time you should check it out with your doctor. Remember, most nipple discharges are harmless.",
      hi:"और स्राव को देखिए। एरिओला के बाहरी किनारे से शुरू करके उँगलियों को निप्पल की ओर लाइए। यदि कोई स्राव हो तो डॉक्टर से सम्पर्क करें — किसी भी समय स्राव दिखे तो डॉक्टर को अवश्य दिखाएँ। याद रखिए, अधिकतर निप्पल स्राव हानिरहित होते हैं।"} },

 { n:5, photo:"step5",
   h:{en:"In the bath or shower",             hi:"स्नान के समय"},
   p:{en:"This step is best done with soapy fingers that glide easily over the skin. Raise your left arm. Use the pads of the fingers of your right hand to check your left breast and the surrounding area — firmly, carefully and thoroughly. Feel for any unusual or new lump or mass under the skin. A lump is unusual if it has not been felt during earlier breast exams and it now stands out against the normal feel of your breast.",
      hi:"जब त्वचा भीगी और साबुन से चिकनी हो, यह चरण सबसे आसान होता है। अपनी बाईं बाँह ऊपर उठाइए। दाहिने हाथ की उँगलियों के पैड से बाएँ स्तन और उसके आस-पास के भाग को मज़बूती से, ध्यान से और पूरी तरह जाँचिए। त्वचा के नीचे किसी भी नई गाँठ या रसौली को महसूस कीजिए। गाँठ असामान्य तब है जब वह पहले की जाँचों में महसूस न हुई हो और अब स्तन के सामान्य स्पर्श से अलग लगे।"} },

 { n:6, photo:"step6",
   h:{en:"Repeat lying down",                 hi:"अब लेटकर दोहराइए"},
   p:{en:"Lie flat on your back, with your left arm over your head and a pillow or folded towel placed under your left shoulder. This position flattens the breast and makes it easier to examine. Check the left breast and the area around it very carefully, using one of the patterns described next. Repeat the exam on the right breast.",
      hi:"पीठ के बल सीधे लेट जाइए, बायाँ हाथ सिर के ऊपर और बाएँ कंधे के नीचे तौलिया या तकिया रख लीजिए। इस स्थिति में स्तन सीधा हो जाता है और निरीक्षण आसान हो जाता है। बाएँ स्तन और उसके आस-पास के भाग को आगे बताए गए किसी एक तरीक़े से ध्यान से जाँचिए। उसी प्रकार दाएँ स्तन की भी जाँच कीजिए।"} },

 { n:7, photo:null,
   h:{en:"Compare the same place on both sides", hi:"दोनों ओर एक ही जगह की तुलना कीजिए"},
   p:{en:"If you feel something in one breast that appears unusual or different from before, check to see if it is present in your other breast. If the same structure is in the same place in both breasts, the chances are good that your breasts are normal. If you find a lump a few days before or during your period, re-examine your breasts at the end of your period — a lump found at this time may be due to the normal collection of fluid. If the lump does not disappear before your next period begins, see your doctor soon.",
      hi:"यदि एक स्तन में कुछ असामान्य या पहले से अलग लगे, तो देखिए कि क्या वही स्थिति दूसरे स्तन में भी है। यदि वही रचना दोनों स्तनों में उसी स्थान पर है, तो संभावना अधिक है कि आपके स्तन सामान्य हैं। यदि मासिक धर्म से कुछ दिन पहले या उसके दौरान गाँठ महसूस हो, तो माहवारी समाप्त होने पर दोबारा जाँचिए — उस समय की गाँठ अक्सर सामान्य रूप से द्रव इकट्ठा होने से होती है। यदि अगले मासिक चक्र तक गाँठ ग़ायब न हो तो जल्द डॉक्टर से सम्पर्क कीजिए।"} }
];

C.examWhen = {
  en:"If you menstruate, the best time is 2 or 3 days after your period ends, when your breasts are least likely to be tender or swollen. If you no longer menstruate, pick a day — such as the first day of the month — to remind yourself, and write it down.",
  hi:"यदि आपको माहवारी होती है, तो सबसे अच्छा समय माहवारी समाप्त होने के 2–3 दिन बाद है, जब स्तन सबसे कम संवेदनशील या सूजे हुए होते हैं। यदि माहवारी बंद हो चुकी है, तो कोई एक दिन चुन लीजिए — जैसे महीने की पहली तारीख़ — और उसे लिख लीजिए।"
};

C.examTechnique = {
  en:"Use the pads of your fingers, not your fingertips. Feel the tissue by pressing in small, overlapping areas about the size of a one-rupee coin, without lifting your fingers from the breast. Always cover the entire breast, the area between the breast and the underarm, the underarm itself, and the area above the breast up to the collarbone and across to your shoulder — all of this contains breast tissue.",
  hi:"उँगलियों के पैड का प्रयोग कीजिए, उँगलियों के सिरों का नहीं। एक रुपये के सिक्के जितने छोटे-छोटे, एक-दूसरे पर आते हुए हिस्सों में दबाकर महसूस कीजिए, बिना उँगलियाँ स्तन से हटाए। पूरा स्तन, स्तन और बग़ल के बीच का भाग, बग़ल स्वयं, तथा स्तन के ऊपर कॉलरबोन और कंधे तक का भाग अवश्य जाँचिए — इन सब में स्तन के ऊतक होते हैं।"
};

/* Brochure page 5 — Procedures I / II / III, with their own photographs */
C.procedures = [
 { id:"p1", photo:"proc1",
   h:{en:"Circular",  hi:"गोलाकार"},
   p:{en:"Beginning at the outer edge of your breast, move your fingers slowly around the entire breast in a circle. Move around the breast in smaller and smaller circles, gradually working toward the nipple. Don't forget to check the underarm and upper chest areas too.",
      hi:"स्तन के बाहरी किनारे से आरम्भ कीजिए और उँगलियों को गोलाई में पूरे स्तन के चारों ओर धीरे-धीरे घुमाइए। चक्र छोटा करती जाइए और धीरे-धीरे निप्पल तक पहुँचिए। बग़ल और छाती के ऊपरी भाग को देखना मत भूलिए।"} },
 { id:"p2", photo:"proc2",
   h:{en:"Up and down", hi:"ऊपर-नीचे"},
   p:{en:"Start in your under-arm area and move your fingers downward gradually until they are below the breast. Then move your fingers slightly toward the middle and slowly back up. Go up and down until you cover the entire breast area. Be sure to check the underarm area and the upper chest.",
      hi:"बग़ल के भाग से आरम्भ कीजिए और उँगलियों को धीरे-धीरे नीचे स्तन के निचले भाग तक ले जाइए। फिर उँगलियों को थोड़ा बीच की ओर ले जाकर धीरे-धीरे ऊपर लाइए। ऊपर-नीचे करती रहिए जब तक पूरा स्तन न जँच जाए। बग़ल और छाती का ऊपरी भाग अवश्य देखिए।"} },
 { id:"p3", photo:"proc3",
   h:{en:"Wedge",     hi:"चक्रीय (फाँक)"},
   p:{en:"Starting at the outer edge of your breast, move your fingers toward the nipple and back to the edge. Check your entire breast, covering one small wedge-shaped section at a time. Again, be sure to check the underarm area and the upper chest.",
      hi:"स्तन के बाहरी किनारे से आरम्भ कीजिए। उँगलियों को निप्पल तक ले जाइए और फिर किनारे तक वापस। एक बार में एक छोटी फाँक जाँचते हुए पूरा स्तन देखिए। पुनः बग़ल और छाती का ऊपरी भाग अवश्य जाँचिए।"} }
];

C.procedureEnd = {
  en:"Before concluding the exam, depress the nipple into a natural \"well\". It should feel smooth. Start with your left breast, then repeat the exam on your right breast.",
  hi:"जाँच समाप्त करने से पहले निप्पल को दबाकर देखिए — वह चिकना महसूस होना चाहिए। बाएँ स्तन से शुरू कीजिए, फिर दाएँ स्तन की भी उसी प्रकार जाँच कीजिए।"
};

/* ------------------------------------------------------------- SIGNS ----
   Source: sgpgibreasthealth.org.in — "Lump is not the only presentation".
   The brochure carries no photographs of these, so each round is drawn.
   hot = tappable target in the illustration's 0–200 coordinate space;
   hot:null means this round is normal and the correct answer is the button.
   ------------------------------------------------------------------------ */
C.signs = [
 { id:"s1", art:"normal", hot:null,
   h:{en:"Nothing wrong here",  hi:"यहाँ कुछ भी असामान्य नहीं"},
   p:{en:"This breast is normal. Being able to say \"this looks normal\" matters just as much as spotting a change — most breasts are normal most of the time.",
      hi:"यह स्तन सामान्य है। \"यह सामान्य है\" पहचान पाना भी उतना ही ज़रूरी है जितना बदलाव पहचानना — अधिकतर समय अधिकतर स्तन सामान्य ही होते हैं।"} },

 { id:"s2", art:"dimple", hot:{x:152,y:86,r:36},
   h:{en:"Dimpling or puckering", hi:"गड्ढा या सिकुड़न"},
   p:{en:"The skin is pulled inward at one point, like a small dent. It often shows up only when the arms are raised — which is exactly why step 2 of the self-examination exists.",
      hi:"त्वचा किसी एक जगह अंदर की ओर खिंची होती है, छोटे गड्ढे जैसी। यह अक्सर हाथ उठाने पर ही दिखती है — इसीलिए स्वयं जाँच का दूसरा चरण ज़रूरी है।"} },

 { id:"s3", art:"retract", hot:{x:100,y:112,r:34},
   h:{en:"Nipple retraction", hi:"निप्पल का अंदर धँसना"},
   p:{en:"A nipple newly pulled inward or to one side. A nipple that has been inverted since youth and has not changed is usually not a concern — it is the change that matters.",
      hi:"निप्पल नया-नया अंदर धँसा या एक ओर खिंचा हुआ। जो निप्पल जवानी से धँसा हो और बदला न हो, वह आमतौर पर चिंता की बात नहीं — बदलाव महत्वपूर्ण है।"} },

 { id:"s4", art:"peau", hot:{x:100,y:112,r:56},
   h:{en:"Skin like orange peel", hi:"संतरे के छिलके जैसी त्वचा"},
   p:{en:"Thickened skin with enlarged pores. It may come with swelling, warmth or redness of the breast, and it needs to be seen by a doctor without delay.",
      hi:"मोटी त्वचा जिसमें रोमछिद्र बड़े दिखें। इसके साथ स्तन में सूजन, गर्माहट या लालिमा हो सकती है। इसे बिना देर किए डॉक्टर को दिखाना चाहिए।"} },

 { id:"s5", art:"red", hot:{x:118,y:92,r:42},
   h:{en:"Redness", hi:"लालिमा"},
   p:{en:"A warm, red, swollen area — sometimes the whole breast. It can look like an infection, and it is often treated as one for weeks. If redness does not settle quickly, it must be re-examined.",
      hi:"गर्म, लाल, सूजा हुआ भाग — कभी-कभी पूरा स्तन। यह संक्रमण जैसा लग सकता है और अक्सर हफ़्तों तक वैसा ही इलाज होता रहता है। यदि लालिमा जल्दी ठीक न हो तो दोबारा जाँच ज़रूरी है।"} },

 { id:"s6", art:"contour", hot:{x:156,y:78,r:34},
   h:{en:"A bulge changing the outline", hi:"बाहरी रेखा बदलती हुई उभार"},
   p:{en:"A lump large enough to change the shape of the breast from the outside. The outline of the breast is as informative as what you can feel.",
      hi:"इतनी बड़ी गाँठ कि बाहर से स्तन का आकार ही बदल जाए। स्तन की बाहरी रेखा उतनी ही जानकारी देती है जितनी हाथ से महसूस होने वाली गाँठ।"} },

 { id:"s7", art:"axilla", hot:{x:78,y:96,r:32},
   h:{en:"A lump in the armpit", hi:"बग़ल में गाँठ"},
   p:{en:"A firm swelling in the underarm. This can appear before anything at all is felt in the breast itself, which is why every self-examination must include the armpit.",
      hi:"बग़ल में सख़्त सूजन। यह स्तन में कुछ भी महसूस होने से पहले भी आ सकती है — इसीलिए हर स्वयं जाँच में बग़ल शामिल करना ज़रूरी है।"} },

 { id:"s8", art:"discharge", hot:{x:100,y:130,r:34},
   h:{en:"Blood-stained discharge", hi:"ख़ून मिला स्राव"},
   p:{en:"Discharge that comes on its own, from one side, and is blood-stained. Most nipple discharges are harmless — but this particular kind needs prompt evaluation.",
      hi:"अपने आप निकलने वाला, एक ओर से आने वाला, ख़ून मिला स्राव। अधिकतर निप्पल स्राव हानिरहित होते हैं — पर इस प्रकार की तुरंत जाँच ज़रूरी है।"} },

 { id:"s9", art:"size", hot:{x:146,y:112,r:52},
   h:{en:"A change in size or shape", hi:"आकार या रूप में बदलाव"},
   p:{en:"One breast newly different from the other, or from how it used to be. Breasts are rarely a perfect match — it is a new difference that matters.",
      hi:"एक स्तन दूसरे से, या पहले से, नया-नया अलग लगे। दोनों स्तन बिलकुल एक जैसे कम ही होते हैं — नया अंतर ही महत्वपूर्ण है।"} }
];

/* --------------------------------------------------------- SCREENING ----
   Source: brochure page 2 — "Early Detection of Breast Cancer".
   ------------------------------------------------------------------------ */
C.screening = [
 { h:{en:"Awareness", hi:"जानकारी"},
   p:{en:"Being aware that breast cancer is a common disease in women after 45 years of age.",
      hi:"यह जानना कि 45 वर्ष की आयु के बाद महिलाओं में स्तन कैंसर एक आम बीमारी है।"} },
 { h:{en:"Breast Self-Examination", hi:"स्तन आत्म-परीक्षण"},
   p:{en:"Examination of the breasts in a systematic and regular manner by a lady herself.",
      hi:"स्त्री द्वारा स्वयं, चरणबद्ध एवं नियमित रूप से अपने स्तनों की जाँच।"} },
 { h:{en:"Clinical Breast Examination", hi:"चिकित्सीय स्तन परीक्षण"},
   p:{en:"Periodic — once every year — examination of a normal lady's breast by a doctor or surgeon.",
      hi:"सामान्य स्त्रियों में वर्ष में कम से कम एक बार किसी डॉक्टर या सर्जन द्वारा स्तन परीक्षण।"} },
 { h:{en:"Detection by Mammography", hi:"मैमोग्राफ़ी द्वारा जाँच"},
   p:{en:"Screening mammography is a specialised X-ray test of the breasts. It may be performed once every year to once every alternate year, to detect cancers even before they can be felt.",
      hi:"मैमोग्राफ़ी स्क्रीनिंग स्तन का एक विशेष एक्स-रे परीक्षण है। यह साल में एक बार या हर दूसरे साल किया जा सकता है, जिससे कैंसर हाथ में महसूस होने से पहले ही पकड़ में आ जाए।"} }
];

C.curable = {
  en:"Breast Cancer is curable if detected at an early disease stage.",
  hi:"प्रारम्भिक अवस्था में जाँच हो जाने पर स्तन कैंसर का इलाज पूरी तरह सम्भव है।"
};

/* -------------------------------------------------------------- VIDEOS --
   All from the department's own gallery. The "Q" numbering is never shown.
   ------------------------------------------------------------------------ */
C.videoSeries = [
  {id:"glAMeQAlEac", t:{en:"Introduction",  hi:"परिचय"}},
  {id:"9RkxDtyisxc", t:{en:"Part 1",  hi:"भाग 1"}},
  {id:"S96CZubA0H8", t:{en:"Part 2",  hi:"भाग 2"}},
  {id:"W1iC0DiPphY", t:{en:"Part 3",  hi:"भाग 3"}},
  {id:"21a5R91ovaU", t:{en:"Part 4",  hi:"भाग 4"}},
  {id:"lMkDshMxVbc", t:{en:"Part 5",  hi:"भाग 5"}},
  {id:"DuHR5cLh7nE", t:{en:"Part 6",  hi:"भाग 6"}},
  {id:"8QidO8eFwAU", t:{en:"Part 7",  hi:"भाग 7"}},
  {id:"FA834Th0aoo", t:{en:"Part 8",  hi:"भाग 8"}},
  {id:"orqwDruQ1ro", t:{en:"Part 9",  hi:"भाग 9"}},
  {id:"OIowDq3OkTk", t:{en:"Part 10", hi:"भाग 10"}},
  {id:"9p1X5IIe3_8", t:{en:"Part 11", hi:"भाग 11"}}
];

C.videoFeature = [
  {id:"0al4tvGqVCU", t:{en:"Early Detection of Breast Cancer: Saving Lives and Breasts — TEDxLucknowSalon",
                        hi:"स्तन कैंसर की जल्दी पहचान: जीवन और स्तन दोनों बचाना — TEDxLucknowSalon"}},
  {id:"fM7ZoHpN7aU", t:{en:"The truth about breast cancer — in conversation with Dr. Gaurav Agarwal",
                        hi:"स्तन कैंसर का सच — डॉ. गौरव अग्रवाल से बातचीत"}},
  {id:"8Y62rKroKio", t:{en:"Breast cancer symptoms — interview, President of Breast Surgery International",
                        hi:"स्तन कैंसर के लक्षण — साक्षात्कार"}},
  {id:"OLMMtej_4lk", t:{en:"Mastectomy, breast conservation surgery and oncoplasty",
                        hi:"मास्टेक्टॉमी, स्तन-संरक्षण सर्जरी और ऑन्कोप्लास्टी"}}
];

/* Certificate copy — visual language taken from the Pink Wave 2026 poster */
C.cert = {
  eyebrow: {en:"SGPGI BREAST HEALTH PROGRAM · LUCKNOW",
            hi:"एसजीपीजीआई ब्रेस्ट हेल्थ प्रोग्राम · लखनऊ"},
  label:   {en:"CERTIFICATE OF BREAST AWARENESS", hi:"स्तन जागरूकता प्रमाणपत्र"},
  certify: {en:"This is to certify that",          hi:"प्रमाणित किया जाता है कि"},
  did:     {en:"completed the Pink Wave Awareness Challenge",
            hi:"ने पिंक वेव जागरूकता चुनौती पूरी की"},
  score:   {en:"SCORE",                             hi:"स्कोर"},
  took:    {en:"and has taken the Pink Pledge",     hi:"और पिंक प्रतिज्ञा ली"},
  script:  {en:"Early Detection Saves Lives",       hi:"जल्दी पहचान जान बचाती है"},
  where:   {en:"Breast Cancer Awareness Walkathon · 4 October 2026 · Lucknow",
            hi:"स्तन कैंसर जागरूकता वॉकाथॉन · 4 अक्टूबर 2026 · लखनऊ"},
  motto:   {en:"TOGETHER FOR A BREAST CANCER FREE TOMORROW",
            hi:"स्तन कैंसर मुक्त कल के लिए — साथ मिलकर"}
};

C.mapUrl = "https://maps.app.goo.gl/RXDnKuQUuPk2BGFp6";
C.mapCta = {en:"Open in Maps", hi:"मैप में खोलें"};

/* --------------------------------------------------------------- EVENT -- */
C.event = [
 {k:{en:"Date",           hi:"तारीख़"},   v:{en:"Sunday, 4 October 2026",              hi:"रविवार, 4 अक्टूबर 2026"}},
 {k:{en:"Assembly",       hi:"एकत्र"},   v:{en:"6:30 AM",                              hi:"सुबह 6:30"}},
 {k:{en:"Flag-off",       hi:"शुरुआत"},  v:{en:"7:00 AM",                              hi:"सुबह 7:00"}},
 {k:{en:"Start / Finish", hi:"आरंभ / समापन"}, v:{en:"1090 Chauraha, Lucknow",         hi:"1090 चौराहा, लखनऊ"}, map:true},
 {k:{en:"Route",          hi:"मार्ग"},   v:{en:"1090 Chauraha → Taj Hotel → 1090 Chauraha", hi:"1090 चौराहा → ताज होटल → 1090 चौराहा"}},
 {k:{en:"Also",           hi:"साथ में"}, v:{en:"Vintage Car Rally through Lucknow",    hi:"लखनऊ में विंटेज कार रैली"}},
 {k:{en:"Culmination",    hi:"समापन"},   v:{en:"Lucknow Golf Club — breakfast, felicitation, awareness session", hi:"लखनऊ गोल्फ़ क्लब — नाश्ता, सम्मान, जागरूकता सत्र"}}
];

C.clinic = {
  name:{en:"Breast Clinic, Dept. of Endocrine & Breast Surgery, SGPGIMS",
        hi:"ब्रेस्ट क्लिनिक, एंडोक्राइन एवं ब्रेस्ट सर्जरी विभाग, एसजीपीजीआईएमएस"},
  addr:{en:"C-Block, Ground Floor, Old Building · Raebareli Road, Lucknow 226014",
        hi:"सी-ब्लॉक, भूतल, पुरानी बिल्डिंग · रायबरेली रोड, लखनऊ 226014"},
  hours:{en:"Monday to Friday, 9 AM – 5 PM", hi:"सोमवार से शुक्रवार, सुबह 9 से शाम 5"},
  phone:"+91-522-2494409",
  email:"sgpgibreasthealthprogram@gmail.com",
  web:"sgpgibreasthealth.org.in"
};

C.roles = [
 {v:"woman",   t:{en:"A woman",               hi:"एक महिला"}},
 {v:"family",  t:{en:"A family member",       hi:"परिवार का सदस्य"}},
 {v:"health",  t:{en:"A health worker / ASHA",hi:"स्वास्थ्यकर्मी / आशा"}},
 {v:"student", t:{en:"A student",             hi:"विद्यार्थी"}},
 {v:"doctor",  t:{en:"A doctor / nurse",      hi:"डॉक्टर / नर्स"}}
];

C.bands = [
 {min:0,  t:{en:"A good start.",                       hi:"अच्छी शुरुआत।"},
          m:{en:"Much of what most of us believe about breast cancer turns out to be wrong. You now know more than you did six minutes ago — that is the whole point.",
             hi:"स्तन कैंसर के बारे में हम जो मानते हैं उसका बहुत कुछ ग़लत निकलता है। छह मिनट पहले की तुलना में अब आप अधिक जानती हैं — यही उद्देश्य है।"}},
 {min:12, t:{en:"You are breast aware.",               hi:"आप स्तन जागरूक हैं।"},
          m:{en:"You got most of it right. Now make it count — teach the self-examination to three women in your family this week.",
             hi:"आपने अधिकतर सही किया। अब इसे उपयोगी बनाइए — इस हफ़्ते परिवार की तीन महिलाओं को स्वयं जाँच सिखाइए।"}},
 {min:19, t:{en:"Pink Wave champion.",                 hi:"पिंक वेव चैंपियन।"},
          m:{en:"You know your facts. The women around you may not. Share this and start the wave.",
             hi:"आपको तथ्य पता हैं। आपके आसपास की महिलाओं को शायद नहीं। इसे साझा कीजिए और लहर शुरू कीजिए।"}}
];

/* Pledge lines are written as neutral infinitives, not gendered future forms —
   men take the pledge too, and Hindi "करूँगी" would exclude them. */
C.pledgeLines = {
 en:["Examine myself every month",
     "Remind three other women to do the same",
     "See a doctor at the first change"],
 hi:["हर महीने स्वयं जाँच करना",
     "तीन और महिलाओं को यही याद दिलाना",
     "पहला बदलाव दिखते ही डॉक्टर को दिखाना"]
};
