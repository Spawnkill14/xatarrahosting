# XatarraHosting | El teu hosting amb xatarra de confiança.
Projecte de creació d'una infraestructura de hosting web professional utilitzant maquinari reciclat, energia solar i intel·ligència artificial local.
---

## Context: 
#### El projecte “XataraHosting”  amb l’objectiu de donar una segona vida a ordinadors antics que actualment no tenen ús, transformant-los en servidors capaços d’oferir allotjament web de petit i mitjà format. A diferència de les empreses de hosting tradicionals, XataraHosting busca aprofitar maquinari ja existent per reduir residus electrònics i demostrar que és possible crear una infraestructura funcional, econòmica i sostenible. Actualment, gran part dels ordinadors desfasats continuen sent plenament útils per a tasques d’allotjament si es gestionen correctament. L’objectiu és crear un sistema de servidors basat en Linux i virtualització amb Proxmox, capaç d’allotjar pàgines web i serveis bàsics d’una manera eficient i escalable.

---
## Abast: 
#### L’objectiu principal del projecte és dissenyar i posar en marxa una infraestructura de hosting mitjançant la reutilització de maquinari antic, oferint serveis web a través d’un sistema col·laboratiu sustentat per la comunitat de Patreon. 
#### Objectius específics:
#### Configurar diversos ordinadors antics com a servidors virtualitzats amb Proxmox.
#### Implementar màquines virtuals amb sistemes Linux (Debian o Ubuntu Server) per a tasques de hosting.
#### Contractar una IP pública a través d’un distribuïdor d’Internet per poder oferir serveis externs.
#### Desenvolupar una pàgina web principal del projecte amb informació, accés a Patreon i sistema d’alta de nous usuaris.
#### Oferir als patreons un domini gratuït i publicitat dins del nostre ecosistema com a forma d’incentiu.
#### Aplicar mesures de seguretat bàsiques (firewall, còpies de seguretat, restricció d’accés remot).

---

## L'Arquitectura Tècnica (Com funciona?)

El sistema es divideix en tres pilars fonamentals ubicats en un garatge:

### 1. La Cabina de Dades (El Cor)
* **Hardware:** Un PC amb configuració multi-disc gestionat per **XigmaNAS**.
* **Seguretat:** Implementació de **ZFS** en configuració **RAID-Z** per garantir la protecció de dades davant fallades físiques de discos.
* **Funció:** Emmagatzematge centralitzat que comparteix els recursos per la xarxa mitjançant el protocol **NFS**.



### 2. El Clúster de Computació (El Múscul)
* **Hardware:** Nodes basats en PCs antics rehabilitats amb **Proxmox VE**.
* **Funcionament:** Arquitectura *diskless-data* (els nodes no emmagatzemen dades localment, les llegeixen del NAS via NFS).
* **Alta Disponibilitat:** Si un node de càlcul falla, el sistema permet que un altre node assumeixi la càrrega de treball a l'instant.

### 3. La IA Guardiana (El Cervell)
* **Tecnologia:** Script personalitzat en **Python** integrat amb **Ollama** (Model d'IA local).
* **Tasques Clau:**
    * **Ciberseguretat:** Monitoratge actiu de logs per detectar patrons d'intrusió i execució de bloquejos automàtics al firewall.
    * **Autoreparació:** Detecció de caigudes de serveis i execució de protocols de reinici o migració en temps real.

---

## Sostenibilitat i Estalvi

El projecte es basa en l'eficiència i el respecte pel medi ambient:

* **Energia Neta:** Sistema alimentat mitjançant un **kit de plaques solars** amb inversor dedicat.
* **Economia Circular:** Reducció dràstica de residus electrònics (e-waste) mitjançant la rehabilitació de components (RAM, CPUs i fonts d'alimentació).
* **Continuïtat Crítica (SAI/UPS):** Protecció contra talls elèctrics. En cas d'absència de llum solar, la IA gestiona un **apagat ordenat** per prevenir la corrupció de dades al sistema ZFS.



---

## Tecnologies Utilitzades

| Capa | Tecnologia |
| :--- | :--- |
| **Virtualització** | Proxmox VE (Clúster) |
| **Emmagatzematge** | XigmaNAS (ZFS + NFS Share) |
| **Seguretat/IA** | Python 3.x + Ollama |
| **Networking** | Nginx Proxy Manager + ZeroTier |
| **Energia** | Kit Solar 12V/24V + SAI Intel·ligent |

---

## Pressupost i Materials 

Com que el projecte es basa en la reutilització, la inversió es concentra en la fiabilitat de la xarxa i la seguretat elèctrica.

### Hardware de Xarxa i Protecció
* **Switch:** Gigabit Ethernet (8 ports) per garantir la fluïdesa del protocol NFS.
* **SAI (UPS):** Sistema d'alimentació ininterrompuda per gestionar l'apagat segur via IA en cas de fallada solar.
* **Emmagatzematge d'arrencada:** SSDs de baixa capacitat (32GB-64GB) per a cada node del clúster.

### Estimació de Costos (Butxaca pròpia mentre no hi han clients)
| Concepte | Prioritat | Preu aprox. |
| :--- | :---: | :---: |
| SSDs per a Nodes Secundaris | Alta | 10 €/u |
| Switch Gigabit | Alta | 20 € |
| Cables Cat6 | Alta | 15 € |
| SAI (Protecció ZFS) | Crítica | 65 € |
| **Inversió Inicial Total** | | **~120 €** |


---

## Propers Passos (Milestones)

1. [ ] **Setup XigmaNAS:** Configurar el RAID-Z i exportar el recurs NFS.
2. [ ] **Clúster Proxmox:** Connectar els nodes secundaris i muntar l'emmagatzematge remot.
3. [ ] **Desenvolupament IA:** Script de monitoratge de logs i connexió amb l'API d'Ollama.
4. [ ] **Proves d'Estrès:** Simular caigudes de xarxa i talls elèctrics per validar l'autoreparació.
