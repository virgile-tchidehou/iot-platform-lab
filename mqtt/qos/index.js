// ============================================================
// Lab 02 — MQTT Quality of Service (QoS 0, 1, 2)
//
// Ce script démontre la différence de comportement entre les 3 niveaux
// de Qualité de Service (QoS) dans MQTT :
//
// QoS 0 : "At most once" — Envoi simple sans confirmation (tirer et oublier)
// QoS 1 : "At least once" — Envoi garanti avec accusé de réception (PUBACK)
// QoS 2 : "Exactly once" — Livraison exacte à 1 exemplaire (handshake 4 étapes)
// ============================================================

const mqtt = require('mqtt');

const BROKER_URL = 'mqtt://test.mosquitto.org';

console.log('=== 📡 Lab 02 — MQTT Quality of Service (QoS 0, 1, 2) ===');
console.log(`Connexion au Broker : ${BROKER_URL}...`);

const client = mqtt.connect(BROKER_URL);

client.on('connect', () => {
  console.log('✅ Connecté au Broker MQTT avec succès !\n');

  // S'abonner aux 3 sujets avec leurs niveaux de QoS respectifs
  client.subscribe('lab/iot/qos/niveau0', { qos: 0 });
  client.subscribe('lab/iot/qos/niveau1', { qos: 1 });
  client.subscribe('lab/iot/qos/niveau2', { qos: 2 });

  console.log('📥 Abonnements effectués :');
  console.log('   ├─ Topic "lab/iot/qos/niveau0" (QoS 0)');
  console.log('   ├─ Topic "lab/iot/qos/niveau1" (QoS 1)');
  console.log('   └─ Topic "lab/iot/qos/niveau2" (QoS 2)\n');

  // Lancer la démonstration de publication
  demarrerTestQoS();
});

// Écoute des messages reçus avec indication du niveau de QoS
client.on('message', (topic, payload, packet) => {
  const donnee = JSON.parse(payload.toString());
  
  console.log(`📩 [MESSAGE REÇU] Topic: "${topic}" | QoS Reçu: ${packet.qos}`);
  console.log(`   └─ Message : "${donnee.message}" | Explication : ${donnee.explication}\n`);
});

client.on('error', (err) => {
  console.error('❌ Erreur MQTT :', err);
});

// Fonction pour envoyer des messages de démonstration avec QoS 0, 1, et 2
function demarrerTestQoS() {
  let compteur = 1;

  setInterval(() => {
    console.log(`--- 🔄 Séquence de test #${compteur} ---`);

    // 1. Envoi avec QoS 0 (Sans confirmation)
    client.publish('lab/iot/qos/niveau0', JSON.stringify({
      message: 'Donnée télémétrique (Température)',
      explication: 'QoS 0 — Rapide, pas de confirmation (At most once)'
    }), { qos: 0 }, () => {
      console.log('📤 [ENVOYÉ] QoS 0 transmis au broker');
    });

    // 2. Envoi avec QoS 1 (Avec accusé de réception PUBACK)
    client.publish('lab/iot/qos/niveau1', JSON.stringify({
      message: 'Alerte Seuil Dépassement',
      explication: 'QoS 1 — Livraison garantie avec PUBACK (At least once)'
    }), { qos: 1 }, (err) => {
      if (!err) console.log('📤 [ENVOYÉ + PUBACK] QoS 1 confirmé par le broker !');
    });

    // 3. Envoi avec QoS 2 (Livraison unique garantie)
    client.publish('lab/iot/qos/niveau2', JSON.stringify({
      message: 'Commande Actionneur (Arrosage ON)',
      explication: 'QoS 2 — Livraison unique garantie (Exactly once)'
    }), { qos: 2 }, (err) => {
      if (!err) console.log('📤 [ENVOYÉ + HANDSHAKE] QoS 2 validé par le broker !');
    });

    compteur++;
  }, 4000); // Toutes les 4 secondes
}
