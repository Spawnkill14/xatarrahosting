# 💻 Configuració Integral: Proxmox VE (Compute Cluster)

Aquest document detalla com convertir els PCs de xatarra en un clúster d'alta disponibilitat.

## 1. Setup dels Nodes
Cada PC ha de tenir una instal·lació neta de Proxmox en el seu propi SSD local (32GB/64GB).

* **Node Principal:** IP `192.168.1.10`
* **Nodes Secundaris:** IPs consecutives (`.11`, `.12`...)

## 2. Connexió a la Cabina (Muntatge NFS)
Un cop instal·lat, hem de "connectar" els nodes al XigmaNAS:

1. Ves a `Datacenter > Storage > Add > NFS`.
2. **ID:** `NAS_Xatarra`
3. **Server:** IP del XigmaNAS (Ex: `192.168.1.5`).
4. **Export:** Tria la ruta exportada del NAS.
5. **Content:** Selecciona:
   * `Disk Image` (Les VMs).
   * `ISO Image` (Sistemes operatius per instal·lar).
   * `Container` (Contenidors LXC).

## 3. Creació del Clúster (Consola)
Perquè els PCs treballin com un sol equip:

* **Al Node Principal:**
```bash
pvecm create XatarraCluster
```
* **Als Nodes Secundaris (per unir-se):**
```bash
pvecm add 192.168.1.10
```
