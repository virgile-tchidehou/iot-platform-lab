// ============================================================
// Lab 03 — MQTT Retained Messages & Last Will and Testament (LWT)
//
// Ce script démontre deux fonctionnalités essentielles pour la fiabilité IoT :
//
// 1. RETAINED MESSAGE (Message Retenu) :
//    Le Broker conserve le dernier message publié sur un sujet.
//    Un nouveau client qui s'abonne plus tard le reçoit IMMÉDIATEMENT.
//
// 2. LAST WILL & TESTAMENT (LWT / Testament) :
//    Message configuré à la connexion. Si l'équipement subit une
//    déconnexion brutale (panne de batterie/réseau), le Broker publie
//    automatiquement ce testament pour avertir les abonnés !
// ============================================================

const mqtt = require('mqtt');

const BROKER_URL = 'mqtt://test.mosquitto.org';
const TOPIC_STATUT = 'lab/iot/device/statut';

console.log('=== 📡 Lab 03 — MQTT Retained Messages & Last Will (LWT) ===\n');

// ─── 1. Simulation de l'équipement IoT (Capteur) ────────────
console.log('[ÉQUIPEMENT IoT] Connexion au Broker avec un Testament (LWT)...');

const clientCapteur = mqtt.connect(BROKER_URL, {
  clientId: 'esp32_station_agricole',
  // Configuration du Last Will & Testament (LWT)
  will: {
    topic: TOPIC_STATUT,
    payload: JSON.stringify({
      etat: '🔴 HORS_LIGNE (Testament LWT)',
      raison: 'Déconnexion brutale / Perte de batterie ou de signal'
    }),
    qos: 1,
    retain: true // Le statut d'absence reste retenu
  }
});

clientCapteur.on('connect', () => {
  console.log('✅ [ÉQUIPEMENT IoT] Connecté !');

  // Publication de l'état "EN_LIGNE" en mode Retained (retain: true)
  const messageEnLigne = JSON.stringify({
    etat: '🟢 EN_LIGNE',
    appareil: 'ESP32 Station Météo',
    firmware: 'v1.2.0',
    timestamp: new Date().toLocaleTimeString()
  });

  clientCapteur.publish(TOPIC_STATUT, messageEnLigne, { qos: 1, retain: true }, () => {
    console.log(`📤 [ÉQUIPEMENT IoT] Statut "EN_LIGNE" publié avec retain: true sur "${TOPIC_STATUT}"\n`);
  });
});

// ─── 2. Simulation d'un Dashboard Web (Abonné tardif) ────────
setTimeout(() => {
  console.log('---------------------------------------------------------');
  console.log('[DASHBOARD WEB] Ouverture de l application par l utilisateur...');
  console.log('[DASHBOARD WEB] Connexion et abonnement au statut...');

  const clientDashboard = mqtt.connect(BROKER_URL, { clientId: 'dashboard_web_client' });

  clientDashboard.on('connect', () => {
    clientDashboard.subscribe(TOPIC_STATUT, () => {
      console.log(`📥 [DASHBOARD WEB] Abonné à "${TOPIC_STATUT}"`);
      console.log('👉 Observation : Le Dashboard reçoit IMMÉDIATEMENT le dernier état retenu !\n');
    });
  });

  clientDashboard.on('message', (topic, payload) => {
    const donnee = JSON.parse(payload.toString());
    console.log(`📩 [DASHBOARD WEB REÇOIT] Statut actuel : ${donnee.etat}`);
    console.log(`   └─ Détails : ${JSON.stringify(donnee)}\n`);
  });

  // ─── 3. Simulation d'une déconnexion brutale de l'équipement ─
  setTimeout(() => {
    console.log('---------------------------------------------------------');
    console.log('⚡ [SIMULATION CRASH] Panne de courant simulée sur l ÉQUIPEMENT IoT !');
    console.log('⚡ Destruction brutale de la connexion socket sans paquet DISCONNECT...\n');

    // Forcer la fermeture brutale du socket pour que le broker déclenche le LWT
    clientCapteur.stream.destroy();

  }, 4000);

}, 2000);
