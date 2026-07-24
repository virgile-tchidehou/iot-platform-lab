// ============================================================
// Lab 01 — MQTT Basics : Publisher & Subscriber
//
// Ce script Node.js démontre le fonctionnement de base de MQTT :
// 1. Connexion à un Broker MQTT public (test.mosquitto.org)
// 2. S'abonner (Subscribe) à un sujet (Topic) : "lab/iot/sensors/temperature"
// 3. Publier (Publish) régulièrement des données simulées
// ============================================================

const mqtt = require('mqtt');

// Adresse du Broker MQTT public de test
const BROKER_URL = 'mqtt://test.mosquitto.org';

// Définition des sujets (Topics) MQTT
const TOPIC_CAPTEUR = 'lab/iot/sensors/temperature';

console.log('=== 📡 Lab 01 — MQTT Basics ===');
console.log(`Connexion au Broker MQTT : ${BROKER_URL}...`);

// Connexion au Broker
const client = mqtt.connect(BROKER_URL);

// Event 1 : Quand la connexion au Broker est réussie
client.on('connect', () => {
  console.log('✅ Connecté au Broker MQTT avec succès !\n');

  // S'abonner au topic de température
  client.subscribe(TOPIC_CAPTEUR, (err) => {
    if (!err) {
      console.log(`📥 Abonné avec succès au Topic : "${TOPIC_CAPTEUR}"`);
      console.log('Envoi des mesures simulées toutes les 3 secondes...\n');

      // Lancer la publication périodique de mesures simulées
      demarrerPublication();
    } else {
      console.error('ERREUR lors de l\'abonnement :', err);
    }
  });
});

// Event 2 : Quand un message MQTT est reçu sur un Topic auquel on est abonné
client.on('message', (topic, payload) => {
  try {
    // Le payload arrive sous forme de Buffer, on le convertit en string puis JSON
    const donnee = JSON.parse(payload.toString());
    
    console.log(`📩 [MESSAGE REÇU] Topic: "${topic}"`);
    console.log(`   └─ Température : ${donnee.valeur} °C | Unité : ${donnee.unite} | Horodatage : ${donnee.horodatage}\n`);
  } catch (e) {
    console.log(`📩 [MESSAGE BRUT] Topic: "${topic}" -> Payload: ${payload.toString()}`);
  }
});

// Event 3 : En cas d'erreur de connexion
client.on('error', (err) => {
  console.error('❌ Erreur de connexion MQTT :', err);
});

// Fonction pour simuler la lecture d'un capteur et la publier
function demarrerPublication() {
  setInterval(() => {
    // Simulation d'une valeur de température entre 20°C et 30°C
    const temperature = (20 + Math.random() * 10).toFixed(1);

    // Formatage des données au format JSON (bonne pratique IoT)
    const donneeCapteur = {
      valeur: parseFloat(temperature),
      unite: '°C',
      horodatage: new Date().toLocaleTimeString()
    };

    // Publication du message JSON sur le Topic
    const payloadStr = JSON.stringify(donneeCapteur);
    client.publish(TOPIC_CAPTEUR, payloadStr);

    console.log(`📤 [MESSAGE ENVOYÉ] Température simulée : ${temperature} °C`);

  }, 3000); // Toutes les 3 secondes
}
