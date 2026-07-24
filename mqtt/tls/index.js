// ============================================================
// Lab 04 — MQTT TLS Encryption (Communication Sécurisée MQTTS)
//
// Ce script démontre la connexion sécurisée à un Broker MQTT via TLS/SSL :
// 1. Utilisation du protocole "mqtts://" au lieu de "mqtt://"
// 2. Port sécurisé 8883 (au lieu du port non sécurisé 1883)
// 3. Chiffrement de toutes les données transmises sur le réseau
// ============================================================

const mqtt = require('mqtt');

// Broker public Mosquitto avec support MQTTS chiffré sur port 8883
const BROKER_SECURISE = 'mqtts://test.mosquitto.org:8883';
const TOPIC_SECURISE  = 'lab/iot/secure/sensors';

console.log('=== 🔒 Lab 04 — MQTT TLS Encryption (MQTTS) ===');
console.log(`Connexion sécurisée TLS au Broker : ${BROKER_SECURISE}...`);

// Configuration des options TLS
const optionsConnexion = {
  clientId: 'station_securisee_esp32',
  port: 8883,
  protocol: 'mqtts',
  // rejectUnauthorized: false permet de se connecter aux brokers de test
  // sans fournir de fichier de certificat CA personnalisé.
  rejectUnauthorized: false 
};

// Connexion chiffrée
const client = mqtt.connect(BROKER_SECURISE, optionsConnexion);

client.on('connect', () => {
  console.log('✅ [TLS HANDSHAKE RÉUSSI] Connexion chiffrée établie avec succès sur le port 8883 !');
  console.log('🔒 Tous les messages échangés sont chiffrés avec TLS.\n');

  // S'abonner au topic sécurisé
  client.subscribe(TOPIC_SECURISE, { qos: 1 }, (err) => {
    if (!err) {
      console.log(`📥 Abonné au Topic Sécurisé : "${TOPIC_SECURISE}"`);
      demarrerEnvoiSecurise();
    } else {
      console.error('ERREUR lors de l abonnement :', err);
    }
  });
});

// Écoute des messages chiffrés reçus
client.on('message', (topic, payload) => {
  const donnee = JSON.parse(payload.toString());
  
  console.log(`📩 [MESSAGE SÉCURISÉ REÇU] Topic: "${topic}"`);
  console.log(`   └─ Pression : ${donnee.pression} hPa | Sécurité : ${donnee.securite} | Heure : ${donnee.horodatage}\n`);
});

client.on('error', (err) => {
  console.error('❌ Erreur de connexion TLS :', err);
});

// Publication de données chiffrées toutes les 4 secondes
function demarrerEnvoiSecurise() {
  setInterval(() => {
    const pressionSimulee = (1013.25 + (Math.random() * 10 - 5)).toFixed(2);

    const donneeSecurisee = {
      pression: parseFloat(pressionSimulee),
      unite: 'hPa',
      securite: 'Chiffrement TLS 1.3 Active',
      horodatage: new Date().toLocaleTimeString()
    };

    client.publish(TOPIC_SECURISE, JSON.stringify(donneeSecurisee), { qos: 1 }, () => {
      console.log(`📤 [ENVOI SÉCURISÉ MQTTS] Pression : ${pressionSimulee} hPa (Données chiffrées en transit)`);
    });

  }, 4000);
}
