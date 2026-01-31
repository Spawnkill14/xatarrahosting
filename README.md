# XatarraHosting | El teu hosting amb xatarra de confiança.
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
# XatarraHosting: Reutilització i Sostenibilitat

Projecte de creació d'una infraestructura de hosting web professional utilitzant maquinari reciclat, energia solar i intel·ligència artificial local.

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

* **Virtualització:** Proxmox VE
* **Emmagatzematge:** XigmaNAS (ZFS + NFS)
* **Llenguatges:** Python
* **Intel·ligència Artificial:** Ollama (Llama/Phi models)
* **Xarxa:** ZeroTier & Nginx Proxy Manager
