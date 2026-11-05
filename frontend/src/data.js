// All data in this file is ILLUSTRATIVE sample content for the frontend prototype.
// Nothing here is a verified product spec, a real listing, a real review or a real event.

export const products = [
  {id:"scarlett", brand:"Focusrite", name:"Scarlett 2i2 (4th Gen)", category:"Audio interfaces", connection:"USB-C", use:"Recording", accent:"orange", icon:"interface", note:"Compact 2-input recording interface"},
  {id:"sm7b", brand:"Shure", name:"SM7B", category:"Microphones", connection:"XLR", use:"Voice / broadcast", accent:"slate", icon:"mic", note:"Dynamic vocal microphone"},
  {id:"sm58", brand:"Shure", name:"SM58", category:"Microphones", connection:"XLR", use:"Vocals / live", accent:"slate", icon:"mic", note:"Dynamic vocal microphone"},
  {id:"hs5", brand:"Yamaha", name:"HS5", category:"Monitors", connection:"XLR / TRS", use:"Monitoring", accent:"blue", icon:"speaker", note:"Active nearfield studio monitor"},
  {id:"minilab", brand:"Arturia", name:"MiniLab 3", category:"Controllers", connection:"USB / MIDI", use:"Music production", accent:"sand", icon:"keys", note:"Compact MIDI keyboard controller"},
  {id:"nt1", brand:"RØDE", name:"NT1", category:"Microphones", connection:"XLR", use:"Recording", accent:"purple", icon:"mic", note:"Condenser studio microphone"},
  {id:"dt770", brand:"beyerdynamic", name:"DT 770 PRO", category:"Headphones", connection:"Analog audio", use:"Monitoring", accent:"indigo", icon:"headphones", note:"Closed-back studio headphones"},
  {id:"m50x", brand:"Audio-Technica", name:"ATH-M50x", category:"Headphones", connection:"Analog audio", use:"Monitoring", accent:"sand", icon:"headphones", note:"Closed-back studio headphones"}
];

export const demoMarket = [
  {id:"demo1", title:"Pair of stage microphones", category:"Microphones", location:"Geneva", direction:"request", type:"borrow", price:0, source:"Network preview", availability:"Flexible", demo:true},
  {id:"demo2", title:"Audio interface, 2 inputs", category:"Audio interfaces", location:"Annemasse", direction:"request", type:"rent", price:0, source:"Network preview", availability:"This month", demo:true},
  {id:"demo3", title:"Shure SM7B", category:"Microphones", location:"Lyon", direction:"offer", type:"rent", price:18, source:"Tools demo", availability:"Available", demo:true},
  {id:"demo4", title:"Yamaha HS5 (pair)", category:"Monitors", location:"Annecy", direction:"offer", type:"sell", price:240, source:"Tools demo", availability:"Available", demo:true}
];

export const otherStudios = [
  {id:"os1", name:"Studio Léman", place:"Geneva", kind:"Home recording studio", tags:["Vocal booth","Audio interface","2 monitors"], terms:"Free lending"},
  {id:"os2", name:"La Petite Salle", place:"Annecy", kind:"Rehearsal room", tags:["Drum kit","PA system","Amps"], terms:"Rental"},
  {id:"os3", name:"Atelier Sonore", place:"Lyon", kind:"Podcast studio", tags:["4 microphones","Mixer","Acoustic treatment"], terms:"Rental"}
];

export const newsReleases = [
  {id:"r1", title:"Compact 2-channel USB audio interface announced", maker:"Example Maker", when:"This week", category:"Audio interfaces"},
  {id:"r2", title:"New generation of a dynamic vocal microphone", maker:"Example Maker", when:"Last week", category:"Microphones"},
  {id:"r3", title:"Active nearfield monitors in two sizes", maker:"Example Maker", when:"Two weeks ago", category:"Monitors"}
];

export const newsReviews = [
  {id:"v1", title:"A month with a compact audio interface", product:"Sample USB interface", by:"Verified owner", lang:"German", excerpt:"Placeholder text showing how a translated review reads. It would cover setup, noise and what the owner actually uses it for.", original:"Platzhaltertext, der zeigt, wie eine übersetzte Bewertung aussieht. Sie würde Einrichtung, Rauschen und den tatsächlichen Einsatz behandeln."},
  {id:"v2", title:"Is a dynamic microphone enough for a home vocal booth?", product:"Sample dynamic microphone", by:"Verified owner", lang:"French", excerpt:"Placeholder text for a second review, written in French and shown here in English.", original:"Texte d'exemple pour un deuxième avis, rédigé en français et affiché ici en anglais."},
  {id:"v3", title:"Nearfield monitors: what to check before buying", product:"Sample nearfield monitor", by:"JenLow editorial", lang:"English", excerpt:"Placeholder editorial review: what the product is, who it suits and what to check before you buy.", original:""}
];

export const newsEvents = [
  {id:"e1", day:"14", month:"DEC", title:"Home studio meetup", place:"Geneva", kind:"Meetup"},
  {id:"e2", day:"18", month:"JAN", title:"Gear swap day", place:"Annecy", kind:"Swap"},
  {id:"e3", day:"07", month:"FEB", title:"Live-sound basics workshop", place:"Lyon", kind:"Workshop"}
];

export const labTools = [
  {id:"pad", icon:"phone", name:"Phone control pad", status:"Concept", text:"Turn your phone into a customizable button pad for the actions you repeat most while producing.", steps:["Open the pad on your phone.","Pair it with your computer.","Assign buttons to your own actions."], note:"Needs research: depends on how it can talk to your production software."},
  {id:"stems", icon:"split", name:"Stem splitter", status:"Concept", text:"Separate a track into parts such as vocals, drums and bass.", steps:["Upload an audio file.","Wait while it is processed.","Download the separate parts."], note:"Needs heavy processing, so cost and usage limits are still open."},
  {id:"styles", icon:"music", name:"Style explorer", status:"Concept", text:"Browse music styles with their typical tempo, instruments and sound references.", steps:["Pick a style.","See typical tempo and instruments.","Jump to matching gear in Equipment."], note:"The content has to be written and checked before launch."},
  {id:"labels", icon:"qr", name:"Equipment labels", status:"Planned", text:"Print QR labels for your gear and scan them to open the item in My Studio.", steps:["Pick items in My Studio.","Print the label sheet on any printer.","Scan a label to open the item."], note:"Closest to ready: it uses the inventory that already exists."}
];
