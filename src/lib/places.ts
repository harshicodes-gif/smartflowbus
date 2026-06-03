// Translations for place names (bus stops, neighborhoods) used by routes.
// Keyed by the canonical English string defined in src/lib/buses.ts.
// Missing entries fall back to the English label.
import type { Lang } from "./i18n";

type PlaceDict = Record<string, string>;

const hi: PlaceDict = {
  // Hyderabad
  "Secunderabad Stn": "सिकंदराबाद स्टेशन", "Secunderabad": "सिकंदराबाद",
  "Begumpet": "बेगमपेट", "Punjagutta": "पंजागुट्टा", "Abids": "अबिड्स",
  "Charminar": "चारमीनार", "Koti": "कोटी", "Ameerpet": "अमीरपेट",
  "Kukatpally": "कुकटपल्ली", "KPHB": "केपीएचबी", "KPHB Colony": "केपीएचबी कॉलोनी",
  "Hitech City": "हाईटेक सिटी", "Dilsukhnagar": "दिलसुखनगर", "LB Nagar": "एलबी नगर",
  // Delhi
  "Connaught Pl": "कनॉट प्लेस", "Connaught Place": "कनॉट प्लेस",
  "Karol Bagh": "करोल बाग", "Rajouri Garden": "राजौरी गार्डन",
  "Janakpuri": "जनकपुरी", "Dwarka Sec 21": "द्वारका सेक्टर 21", "Dwarka": "द्वारका",
  "Kashmere Gate": "कश्मीरी गेट", "ITO": "आईटीओ", "AIIMS": "एम्स",
  "Hauz Khas": "हौज़ खास", "Saket": "साकेत", "Anand Vihar": "आनंद विहार",
  "Laxmi Nagar": "लक्ष्मी नगर", "Pragati Maidan": "प्रगति मैदान",
  "Lajpat Nagar": "लाजपत नगर", "Nehru Place": "नेहरू प्लेस",
  // Mumbai
  "Colaba": "कोलाबा", "Churchgate": "चर्चगेट", "Worli": "वरली", "Mahim": "माहिम",
  "Bandra Stn": "बांद्रा स्टेशन", "Bandra": "बांद्रा",
  "Andheri Stn": "अंधेरी स्टेशन", "Andheri": "अंधेरी",
  "Vile Parle": "विले पार्ले", "Santacruz": "सांताक्रूज़",
  "Kalina": "कलिना", "Kurla Stn": "कुर्ला स्टेशन", "Kurla": "कुर्ला",
  "Borivali": "बोरीवली", "Kandivali": "कांदिवली", "Goregaon": "गोरेगांव", "Dadar": "दादर",
  // Bengaluru
  "Majestic": "मैजेस्टिक", "MG Road": "एमजी रोड", "Indiranagar": "इंदिरानगर",
  "Marathahalli": "मराठहल्ली", "Whitefield": "व्हाइटफील्ड",
  "Shivajinagar": "शिवाजीनगर", "Richmond Cir": "रिचमंड सर्कल",
  "Jayanagar": "जयनगर", "Silk Board": "सिल्क बोर्ड",
  "Electronic City": "इलेक्ट्रॉनिक सिटी", "KR Market": "केआर मार्केट",
  "Mekhri Cir": "मेखरी सर्कल", "Hebbal": "हेब्बल",
  "Yelahanka": "येलहंका", "KIA": "केआईए",
  // Chennai
  "Broadway": "ब्रॉडवे", "Egmore": "एगमोर", "T Nagar": "टी नगर",
  "Guindy": "गिंडी", "Tambaram": "ताम्बरम", "Saidapet": "सैदापेट",
  "Nandanam": "नंदनम", "Adyar": "अड्यार", "Thiruvanmiyur": "तिरुवन्मियूर",
  "ECR": "ईसीआर", "CMBT": "सीएमबीटी", "Koyambedu": "कोयम्बेडु",
  "Anna Nagar": "अन्ना नगर", "Anna Nagar W": "अन्ना नगर पश्चिम",
  "Anna Nagar E": "अन्ना नगर पूर्व", "Shenoy Nagar": "शेनॉय नगर",
  // Kolkata
  "Howrah Stn": "हावड़ा स्टेशन", "Esplanade": "एस्प्लेनेड",
  "Park Street": "पार्क स्ट्रीट", "Tollygunge": "टॉलीगंज", "Garia": "गरिया",
  "Karunamoyee": "करुणामयी", "Sealdah": "सियालदह", "Kalighat": "कालीघाट",
  "Behala": "बेहाला", "Ultadanga": "उल्टाडांगा", "Maniktala": "मणिकतला",
  "Babughat": "बाबूघाट", "Salt Lake": "साल्ट लेक",
  // Pune
  "Pune Stn": "पुणे स्टेशन", "University": "विश्वविद्यालय",
  "Aundh": "औंध", "Hinjewadi": "हिंजेवाड़ी", "Swargate": "स्वारगेट",
  "Tilak Rd": "तिलक रोड", "Deccan": "डेक्कन",
  "Karve Nagar": "कर्वे नगर", "Kothrud": "कोथरूड",
  // Ahmedabad
  "Lal Darwaja": "लाल दरवाजा", "Ashram Road": "आश्रम रोड",
  "Navrangpura": "नवरंगपुरा", "IIM": "आईआईएम", "Vastrapur": "वस्त्रापुर",
  "Maninagar": "मनीनगर", "Kalupur": "कालूपुर", "Paldi": "पालड़ी",
  "Prahlad Nagar": "प्रह्लाद नगर", "Bopal": "बोपल",
  // Newly added Hyderabad
  "Paradise": "पैराडाइज़", "RTC X Roads": "आरटीसी एक्स रोड्स",
  "Afzalgunj": "अफ़ज़लगंज", "Mehdipatnam": "मेहदीपटनम",
  "Lakdikapul": "लकड़ी का पुल", "Khairatabad": "खैरताबाद",
  "Patancheru": "पटनचेरु", "Lingampally": "लिंगमपल्ली",
  "Uppal": "उप्पल", "Tarnaka": "तारनाका",
  // Newly added Delhi
  "Anand Vihar ISBT": "आनंद विहार आईएसबीटी", "Akshardham": "अक्षरधाम",
  "Nizamuddin": "निज़ामुद्दीन", "Greater Kailash": "ग्रेटर कैलाश",
  "Mehrauli": "महरौली", "Mori Gate": "मोरी गेट", "Tis Hazari": "तीस हज़ारी",
  "Punjabi Bagh": "पंजाबी बाग", "Uttam Nagar": "उत्तम नगर",
  "Najafgarh": "नजफगढ़", "Shivaji Stadium": "शिवाजी स्टेडियम",
  "INA": "आईएनए", "Okhla": "ओखला", "Badarpur": "बदरपुर",
  "Sarai Kale Khan": "सराय काले खां", "Azadpur": "आज़ादपुर",
  "Rohini Sec 18": "रोहिणी सेक्टर 18",
  // Newly added Mumbai
  "CST": "सीएसटी", "Fort": "फोर्ट", "Mantralaya": "मंत्रालय",
  "Sion": "सायन", "Jogeshwari": "जोगेश्वरी",
  "Vashi": "वाशी", "Mankhurd": "मानखुर्द", "Chembur": "चेम्बूर",
  "Wadala": "वडाला", "Mulund": "मुलुंड", "Bhandup": "भांडुप",
  "Airoli": "ऐरोली", "Thane Stn": "ठाणे स्टेशन",
  // Newly added Bengaluru
  "Banashankari": "बनशंकरी", "Yeshwantpur": "यशवंतपुर",
  "Malleshwaram": "मल्लेश्वरम", "HSR Layout": "एचएसआर लेआउट",
  "Sarjapur": "सरजापुर", "Koramangala": "कोरमंगला", "ITPL": "आईटीपीएल",
  "Lalbagh": "लालबाग", "BTM Layout": "बीटीएम लेआउट",
  "Bommanahalli": "बोम्मनहल्ली",
  // Newly added Chennai
  "Parrys": "पैरीज़", "Mount Road": "माउंट रोड", "Velachery": "वेलाचेरी",
  "Triplicane": "त्रिप्लिकेन", "Nungambakkam": "नुंगमबक्कम",
  "Vadapalani": "वडपलनी", "Porur": "पोरूर", "Avadi": "अवाड़ी",
  "Ambattur": "अंबत्तूर", "Medavakkam": "मेडवक्कम",
  "Sholinganallur": "शोलिंगनल्लूर", "Kelambakkam": "केलंबक्कम",
  // Newly added Kolkata
  "BBD Bagh": "बीबीडी बाग", "VIP Road": "वीआईपी रोड",
  "NSC Airport": "एनएससी हवाई अड्डा", "Jadavpur": "जादवपुर",
  "Gariahat": "गरियाहाट", "Dunlop": "डनलप", "Shyambazar": "श्यामबाज़ार",
  // Newly added Pune
  "Hadapsar": "हडपसर", "Magarpatta": "मगरपट्टा", "Pimpri": "पिंपरी",
  "Katraj": "कात्रज", "Nigdi": "निगडी", "Wagholi": "वाघोली",
  "Viman Nagar": "विमान नगर", "Warje": "वारजे",
  // Newly added Ahmedabad
  "Sarkhej": "सरखेज", "Vasna": "वासना", "Naroda": "नरोडा",
  "Chandkheda": "चांदखेड़ा", "Sabarmati": "साबरमती",
  "RTO Cir": "आरटीओ सर्कल", "Vatva": "वटवा",
  "Thaltej": "थलतेज", "Kankaria": "कांकरिया",
};

const te: PlaceDict = {
  "Secunderabad Stn": "సికింద్రాబాద్ స్టేషన్", "Secunderabad": "సికింద్రాబాద్",
  "Begumpet": "బేగంపేట", "Punjagutta": "పంజాగుట్ట", "Abids": "ఆబిడ్స్",
  "Charminar": "చార్మినార్", "Koti": "కోటి", "Ameerpet": "అమీర్‌పేట",
  "Kukatpally": "కూకట్‌పల్లి", "KPHB": "కేపీహెచ్‌బీ", "KPHB Colony": "కేపీహెచ్‌బీ కాలనీ",
  "Hitech City": "హైటెక్ సిటీ", "Dilsukhnagar": "దిల్‌సుఖ్‌నగర్", "LB Nagar": "ఎల్‌బీ నగర్",
  "Connaught Pl": "కన్నాట్ ప్లేస్", "Connaught Place": "కన్నాట్ ప్లేస్",
  "Karol Bagh": "కరోల్ బాగ్", "Rajouri Garden": "రజౌరి గార్డెన్",
  "Janakpuri": "జనక్‌పురి", "Dwarka": "ద్వారక", "Dwarka Sec 21": "ద్వారక సెక్టార్ 21",
  "Kashmere Gate": "కశ్మీరీ గేట్", "ITO": "ఐటీఓ", "AIIMS": "ఎయిమ్స్",
  "Hauz Khas": "హౌజ్ ఖాస్", "Saket": "సాకేత్", "Anand Vihar": "ఆనంద్ విహార్",
  "Laxmi Nagar": "లక్ష్మీ నగర్", "Pragati Maidan": "ప్రగతి మైదాన్",
  "Lajpat Nagar": "లాజ్‌పత్ నగర్", "Nehru Place": "నెహ్రూ ప్లేస్",
  "Colaba": "కొలాబా", "Churchgate": "చర్చ్‌గేట్", "Worli": "వర్లి", "Mahim": "మహీం",
  "Bandra": "బాంద్రా", "Bandra Stn": "బాంద్రా స్టేషన్",
  "Andheri": "అంధేరి", "Andheri Stn": "అంధేరి స్టేషన్",
  "Vile Parle": "విలే పార్లే", "Santacruz": "సాంటాక్రూజ్",
  "Kalina": "కలీనా", "Kurla": "కుర్లా", "Kurla Stn": "కుర్లా స్టేషన్",
  "Borivali": "బోరివలి", "Kandivali": "కాందివలి", "Goregaon": "గోరెగావ్", "Dadar": "దాదర్",
  "Majestic": "మెజెస్టిక్", "MG Road": "ఎంజీ రోడ్", "Indiranagar": "ఇందిరానగర్",
  "Marathahalli": "మరఠహళ్ళి", "Whitefield": "వైట్‌ఫీల్డ్",
  "Shivajinagar": "శివాజీనగర్", "Richmond Cir": "రిచ్‌మండ్ సర్కిల్",
  "Jayanagar": "జయనగర్", "Silk Board": "సిల్క్ బోర్డ్",
  "Electronic City": "ఎలక్ట్రానిక్ సిటీ", "KR Market": "కేఆర్ మార్కెట్",
  "Mekhri Cir": "మెఖ్రి సర్కిల్", "Hebbal": "హెబ్బాళ",
  "Yelahanka": "ఎలహంక", "KIA": "కేఐఏ",
  "Broadway": "బ్రాడ్‌వే", "Egmore": "ఎగ్మోర్", "T Nagar": "టి నగర్",
  "Guindy": "గింది", "Tambaram": "తాంబరం", "Saidapet": "సైదాపేట",
  "Nandanam": "నందనం", "Adyar": "అడయార్", "Thiruvanmiyur": "తిరువాన్మియూర్",
  "ECR": "ఈసీఆర్", "CMBT": "సీఎంబీటీ", "Koyambedu": "కోయంబేడు",
  "Anna Nagar": "అన్నా నగర్", "Anna Nagar W": "అన్నా నగర్ పశ్చిమ",
  "Anna Nagar E": "అన్నా నగర్ తూర్పు", "Shenoy Nagar": "షెనాయ్ నగర్",
  "Howrah Stn": "హౌరా స్టేషన్", "Esplanade": "ఎస్ప్లనేడ్",
  "Park Street": "పార్క్ స్ట్రీట్", "Tollygunge": "టాలీగంజ్", "Garia": "గరియా",
  "Karunamoyee": "కరుణామయి", "Sealdah": "శియాల్‌దహ్", "Kalighat": "కాళీఘాట్",
  "Behala": "బెహాలా", "Ultadanga": "ఉల్టాదంగా", "Maniktala": "మాణిక్‌తలా",
  "Babughat": "బాబూఘాట్", "Salt Lake": "సాల్ట్ లేక్",
  "Pune Stn": "పూణె స్టేషన్", "University": "విశ్వవిద్యాలయం",
  "Aundh": "ఔంధ్", "Hinjewadi": "హింజేవాడి", "Swargate": "స్వార్‌గేట్",
  "Tilak Rd": "తిలక్ రోడ్", "Deccan": "డెక్కన్",
  "Karve Nagar": "కర్వే నగర్", "Kothrud": "కొథ్రుడ్",
  "Lal Darwaja": "లాల్ దర్వాజా", "Ashram Road": "ఆశ్రమ్ రోడ్",
  "Navrangpura": "నవరంగపుర", "IIM": "ఐఐఎం", "Vastrapur": "వస్త్రాపూర్",
  "Maninagar": "మణినగర్", "Kalupur": "కాలూపూర్", "Paldi": "పాల్డి",
  "Prahlad Nagar": "ప్రహ్లాద్ నగర్", "Bopal": "బోపల్",
};

// Minimal stubs for the remaining languages — they share script families with
// hi/te above and fall back to English when missing, which is far better than
// leaving every label in English.
const ta: PlaceDict = {
  "Secunderabad": "செகந்திராபாத்", "Charminar": "சார்மினார்",
  "Hitech City": "ஹைடெக் சிட்டி", "LB Nagar": "எல்பி நகர்",
  "Connaught Place": "கன்னாட் பிளேஸ்", "Connaught Pl": "கன்னாட் பிளேஸ்",
  "Dwarka": "துவாரகா", "Kashmere Gate": "காஷ்மீரி கேட்", "Saket": "சாகேத்",
  "Anand Vihar": "ஆனந்த் விஹார்", "Nehru Place": "நேரு பிளேஸ்",
  "Colaba": "கொலாபா", "Bandra": "பாந்த்ரா", "Andheri": "அந்தேரி",
  "Kurla": "குர்லா", "Borivali": "போரிவலி", "Dadar": "தாதர்",
  "Majestic": "மெஜஸ்டிக்", "Whitefield": "ஒயிட்ஃபீல்ட்",
  "Electronic City": "எலக்ட்ரானிக் சிட்டி", "KIA": "கே.ஐ.ஏ",
  "Broadway": "பிராட்வே", "Tambaram": "தாம்பரம்", "Saidapet": "சைதாப்பேட்டை",
  "Thiruvanmiyur": "திருவான்மியூர்", "CMBT": "சி.எம்.பி.டி",
  "Anna Nagar": "அண்ணா நகர்", "Howrah Stn": "ஹவ்ரா நிலையம்",
  "Garia": "காரியா", "Salt Lake": "சால்ட் லேக்", "Behala": "பெஹலா",
  "Pune Stn": "புனே நிலையம்", "Hinjewadi": "ஹிஞ்சேவாடி",
  "Swargate": "ஸ்வர்கேட்", "Kothrud": "கோத்ரூட்",
  "Lal Darwaja": "லால் தர்வாஜா", "Vastrapur": "வஸ்த்ராபூர்",
  "Maninagar": "மணிநகர்", "Bopal": "போபால்",
};

const kn: PlaceDict = {
  "Majestic": "ಮೆಜೆಸ್ಟಿಕ್", "MG Road": "ಎಂಜಿ ರೋಡ್",
  "Indiranagar": "ಇಂದಿರಾನಗರ", "Marathahalli": "ಮಾರತ್ತಹಳ್ಳಿ",
  "Whitefield": "ವೈಟ್‌ಫೀಲ್ಡ್", "Shivajinagar": "ಶಿವಾಜಿನಗರ",
  "Jayanagar": "ಜಯನಗರ", "Silk Board": "ಸಿಲ್ಕ್ ಬೋರ್ಡ್",
  "Electronic City": "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ", "KR Market": "ಕೆಆರ್ ಮಾರ್ಕೆಟ್",
  "Hebbal": "ಹೆಬ್ಬಾಳ", "Yelahanka": "ಯಲಹಂಕ", "KIA": "ಕೆಐಎ",
  "Secunderabad": "ಸಿಕಂದರಾಬಾದ್", "Charminar": "ಚಾರ್ಮಿನಾರ್",
  "Hitech City": "ಹೈಟೆಕ್ ಸಿಟಿ", "LB Nagar": "ಎಲ್‌ಬಿ ನಗರ",
  "Connaught Place": "ಕನಾಟ್ ಪ್ಲೇಸ್", "Connaught Pl": "ಕನಾಟ್ ಪ್ಲೇಸ್",
  "Dwarka": "ದ್ವಾರಕ", "Saket": "ಸಾಕೇತ್", "Nehru Place": "ನೆಹರು ಪ್ಲೇಸ್",
  "Colaba": "ಕೊಲಾಬಾ", "Bandra": "ಬಾಂದ್ರಾ", "Andheri": "ಅಂಧೇರಿ",
  "Borivali": "ಬೋರಿವಲಿ", "Dadar": "ದಾದರ್",
  "Broadway": "ಬ್ರಾಡ್‌ವೇ", "Tambaram": "ತಾಂಬರಂ", "Thiruvanmiyur": "ತಿರುವಾನ್ಮಿಯೂರ್",
  "Anna Nagar": "ಅಣ್ಣಾ ನಗರ", "Howrah Stn": "ಹೌರಾ ನಿಲ್ದಾಣ",
  "Garia": "ಗರಿಯಾ", "Salt Lake": "ಸಾಲ್ಟ್ ಲೇಕ್", "Behala": "ಬೆಹಾಲಾ",
  "Pune Stn": "ಪುಣೆ ನಿಲ್ದಾಣ", "Hinjewadi": "ಹಿಂಜೇವಾಡಿ",
  "Swargate": "ಸ್ವಾರ್‌ಗೇಟ್", "Kothrud": "ಕೊತ್ರೂಡ್",
  "Lal Darwaja": "ಲಾಲ್ ದರ್ವಾಜಾ", "Vastrapur": "ವಸ್ತ್ರಾಪುರ",
  "Maninagar": "ಮಣಿನಗರ", "Bopal": "ಬೋಪಲ್",
};

const ml: PlaceDict = {
  "Secunderabad": "സെക്കന്ദരാബാദ്", "Charminar": "ചാർമിനാർ",
  "Hitech City": "ഹൈടെക് സിറ്റി", "LB Nagar": "എൽബി നഗർ",
  "Connaught Place": "കനോട്ട് പ്ലേസ്", "Connaught Pl": "കനോട്ട് പ്ലേസ്",
  "Dwarka": "ദ്വാരക", "Saket": "സാകേത്", "Nehru Place": "നെഹ്റു പ്ലേസ്",
  "Colaba": "കൊളാബ", "Bandra": "ബാന്ദ്ര", "Andheri": "അന്ധേരി",
  "Borivali": "ബോറിവലി", "Dadar": "ദാദർ",
  "Majestic": "മജസ്റ്റിക്", "Whitefield": "വൈറ്റ്‌ഫീൽഡ്",
  "Electronic City": "ഇലക്ട്രോണിക് സിറ്റി",
  "Broadway": "ബ്രോഡ്‌വേ", "Tambaram": "താമ്പരം",
  "Thiruvanmiyur": "തിരുവാൻമിയൂർ", "Anna Nagar": "അണ്ണാ നഗർ",
  "Howrah Stn": "ഹൗറ സ്റ്റേഷൻ", "Salt Lake": "സാൾട്ട് ലേക്ക്",
  "Pune Stn": "പൂനെ സ്റ്റേഷൻ", "Hinjewadi": "ഹിഞ്ചേവാടി",
  "Kothrud": "കോത്രൂഡ്", "Lal Darwaja": "ലാൽ ദർവാജ",
  "Vastrapur": "വസ്ത്രാപൂർ", "Maninagar": "മണിനഗർ", "Bopal": "ബോപാൽ",
};

const bn: PlaceDict = {
  "Howrah Stn": "হাওড়া স্টেশন", "Esplanade": "এসপ্ল্যানেড",
  "Park Street": "পার্ক স্ট্রিট", "Tollygunge": "টালিগঞ্জ", "Garia": "গড়িয়া",
  "Karunamoyee": "করুণাময়ী", "Sealdah": "শিয়ালদহ", "Kalighat": "কালীঘাট",
  "Behala": "বেহালা", "Ultadanga": "উল্টোডাঙ্গা", "Maniktala": "মানিকতলা",
  "Babughat": "বাবুঘাট", "Salt Lake": "সল্ট লেক",
  "Secunderabad": "সেকেন্দ্রাবাদ", "Charminar": "চারমিনার",
  "Hitech City": "হাইটেক সিটি", "LB Nagar": "এলবি নগর",
  "Connaught Place": "কনট প্লেস", "Connaught Pl": "কনট প্লেস",
  "Dwarka": "দ্বারকা", "Saket": "সাকেত", "Nehru Place": "নেহরু প্লেস",
  "Colaba": "কোলাবা", "Bandra": "বান্দ্রা", "Andheri": "আন্ধেরি",
  "Borivali": "বোরিভলি", "Dadar": "দাদর",
  "Majestic": "ম্যাজেস্টিক", "Whitefield": "হোয়াইটফিল্ড",
  "Electronic City": "ইলেকট্রনিক সিটি",
  "Broadway": "ব্রডওয়ে", "Tambaram": "তাম্বরম", "Anna Nagar": "আন্না নগর",
  "Pune Stn": "পুনে স্টেশন", "Hinjewadi": "হিঞ্জেওয়াড়ি",
  "Kothrud": "কোথরুদ", "Lal Darwaja": "লাল দরওয়াজা",
  "Vastrapur": "বস্ত্রাপুর", "Maninagar": "মণিনগর", "Bopal": "বোপাল",
};

const mr: PlaceDict = {
  "Pune Stn": "पुणे स्टेशन", "University": "विद्यापीठ",
  "Aundh": "औंध", "Hinjewadi": "हिंजवडी", "Swargate": "स्वारगेट",
  "Tilak Rd": "टिळक रोड", "Deccan": "डेक्कन",
  "Karve Nagar": "कर्वे नगर", "Kothrud": "कोथरूड",
  "Colaba": "कुलाबा", "Churchgate": "चर्चगेट", "Worli": "वरळी", "Mahim": "माहीम",
  "Bandra": "वांद्रे", "Bandra Stn": "वांद्रे स्टेशन",
  "Andheri": "अंधेरी", "Andheri Stn": "अंधेरी स्टेशन",
  "Vile Parle": "विलेपार्ले", "Santacruz": "सांताक्रूझ",
  "Kalina": "कलिना", "Kurla": "कुर्ला", "Kurla Stn": "कुर्ला स्टेशन",
  "Borivali": "बोरिवली", "Kandivali": "कांदिवली", "Goregaon": "गोरेगाव", "Dadar": "दादर",
  "Secunderabad": "सिकंदराबाद", "Charminar": "चारमिनार",
  "Connaught Place": "कनॉट प्लेस", "Dwarka": "द्वारका",
  "Saket": "साकेत", "Majestic": "मॅजेस्टिक", "Whitefield": "व्हाइटफील्ड",
  "Anna Nagar": "अण्णा नगर", "Tambaram": "तांबरम",
  "Howrah Stn": "हावडा स्टेशन", "Salt Lake": "सॉल्ट लेक",
  "Lal Darwaja": "लाल दरवाजा", "Vastrapur": "वस्त्रापूर",
  "Maninagar": "मणिनगर", "Bopal": "बोपल",
};

const ur: PlaceDict = {
  "Secunderabad": "سکندرآباد", "Charminar": "چارمینار",
  "Hitech City": "ہائی ٹیک سٹی", "LB Nagar": "ایل بی نگر",
  "Connaught Place": "کناٹ پلیس", "Connaught Pl": "کناٹ پلیس",
  "Dwarka": "دوارکا", "Kashmere Gate": "کشمیری گیٹ",
  "Saket": "ساکیت", "Nehru Place": "نہرو پلیس",
  "Anand Vihar": "آنند وہار",
  "Colaba": "کولابا", "Bandra": "باندرہ", "Andheri": "اندھیری",
  "Borivali": "بوریولی", "Dadar": "دادر",
  "Majestic": "میجسٹک", "Whitefield": "وائٹ فیلڈ",
  "Electronic City": "الیکٹرانک سٹی",
  "Broadway": "براڈوے", "Tambaram": "تامبرم", "Anna Nagar": "انا نگر",
  "Howrah Stn": "ہاوڑہ اسٹیشن", "Salt Lake": "سالٹ لیک",
  "Pune Stn": "پونے اسٹیشن", "Hinjewadi": "ہنجے واڑی",
  "Kothrud": "کوتھرود", "Lal Darwaja": "لال دروازہ",
  "Vastrapur": "وستراپور", "Maninagar": "منی نگر", "Bopal": "بوپال",
};

export const PLACES: Record<Lang, PlaceDict> = { en: {}, hi, te, ta, kn, ml, bn, mr, ur };

export function translatePlace(name: string, lang: Lang): string {
  if (!name) return name;
  const dict = PLACES[lang];
  if (dict && dict[name]) return dict[name];
  return name; // English fallback
}

// Translate composite strings like "A → B" by translating each side.
export function translateRouteLabel(label: string, lang: Lang): string {
  if (!label) return label;
  const parts = label.split("→").map((s) => s.trim());
  if (parts.length === 2) {
    return `${translatePlace(parts[0], lang)} → ${translatePlace(parts[1], lang)}`;
  }
  return translatePlace(label, lang);
}
