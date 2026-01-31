# Configuració Integral: XigmaNAS (Storage Core)

Aquest node és el "Cor" del projecte XatarraHosting. Gestiona la persistència de dades i la redundància.

## 1. Configuració de Discos i ZFS
Per garantir que la "xatarra" no perdi dades, configurem un sistema de fitxers d'última generació:

1. **Afegir Discos:** Anar a `Disks > Management` i escanejar els discos SATA connectats.
2. **Crear Virtual Device (VDev):**
   * Tipus: **RAID-Z1** (mínim 3 discos).
   * Proporciona tolerància a la fallada d'1 disc físic.
3. **Crear Pool:** Anomenar-lo `Tank_Xatarra`.

## 2. Optimització del Dataset (Via Shell o Web)
És vital configurar aquests paràmetres per al rendiment de les Màquines Virtuals:
* **Recordsize (64k):** Millora la velocitat de lectura/escriptura de Proxmox.
* **Compression (lz4):** Estalvia espai i millora el rendiment sense gastar CPU.
* **Atime (off):** Estalvia escriptures innecessàries al disc.

```bash
# Comandes manuals si s'usa la consola:
zfs set recordsize=64k Tank_Xatarra
zfs set compression=lz4 Tank_Xatarra
zfs set atime=off Tank_Xatarra
