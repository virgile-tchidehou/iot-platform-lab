# 🌐 IoT Fundamentals — Architecture & Core Concepts

This document summarizes the fundamental architecture of Internet of Things (IoT) systems, serving as the theoretical foundation for this repository.

---

## 🏛️ The 4-Layer IoT Architecture

An end-to-end IoT platform is structured into four primary layers:

```text
┌──────────────────────────────────────────────────────────┐
│  4. Application Layer (Dashboards, Mobile Apps, Analytics) │
└────────────────────────────▲─────────────────────────────┘
                             │ REST API / WebSockets
┌────────────────────────────┴─────────────────────────────┐
│  3. Cloud / Backend Layer (Broker, Database, Services)    │
└────────────────────────────▲─────────────────────────────┘
                             │ MQTT / MQTTS / HTTP
┌────────────────────────────┴─────────────────────────────┐
│  2. Network / Gateway Layer (Wi-Fi, Cellular, LoRaWAN)    │
└────────────────────────────▲─────────────────────────────┘
                             │ I2C / SPI / GPIO / UART
┌────────────────────────────┴─────────────────────────────┐
│  1. Perception / Device Layer (Sensors & Actuators)       │
└──────────────────────────────────────────────────────────┘
```

<div align="center">

![Architecture des couches IoT](../media/Arch_Couche_IoT.png)

*Figure 1 : Représentation visuelle de l'architecture IoT 4 couches.*

</div>

---

## 1️⃣ Perception Layer (Hardware & Edge)
- **Microcontrollers**: ESP32, STM32, Arduino, Raspberry Pi Pico.
- **Sensors**: Measure physical attributes (temperature, humidity, soil moisture, motion, pressure).
- **Actuators**: Relays, motors, valves, pumps.

---

## 2️⃣ Network Layer (Connectivity)
- **Protocols**: Wi-Fi, Ethernet, Bluetooth LE, LoRaWAN, Cellular (GSM/NB-IoT).
- **Gateways**: Bridge local sensor networks to the Internet when devices lack direct IP connectivity.

---

## 3️⃣ Cloud & Middleware Layer (Data Processing)
- **Message Brokers**: Eclipse Mosquitto, EMQX, HiveMQ, AWS IoT Core.
- **Data Storage**: Time-series databases (InfluxDB), Relational (PostgreSQL), NoSQL (Firebase).
- **Processing Engine**: Node.js microservices, Python automation scripts, AWS Lambda.

---

## 4️⃣ Application Layer (User Experience)
- **Real-Time Dashboards**: Web applications displaying graphs, alerts, and system controls.
- **Alert Systems**: Mobile notifications, SMS alerts, automated email reports.

---

## 🔑 Key IoT Design Principles
1. **Low Overhead**: Use bandwidth-efficient protocols like **MQTT** over heavy protocols like traditional HTTP polling.
2. **Asynchronous Communication**: Decouple publishers (sensors) from subscribers (dashboards/backends) via brokers.
3. **Resilience**: Ensure systems can buffer data and auto-reconnect when connection drops occur.
