<?php
$conn = new mysqli("localhost", "mhmk", "Password", "xatarracloud");

// Lògica per Eliminar
if (isset($_GET['delete'])) {
    $vmid = intval($_GET['delete']);
    $conn->query("DELETE FROM servers WHERE vmid = $vmid");
    header("Location: gestordb.php");
}

// Lògica per Editar VMID
if (isset($_POST['edit_vmid'])) {
    $old_id = intval($_POST['old_vmid']);
    $new_id = intval($_POST['new_vmid']);
    $conn->query("UPDATE servers SET vmid = $new_id WHERE vmid = $old_id");
    header("Location: gestordb.php");
}

$res = $conn->query("SELECT * FROM servers ORDER BY vmid ASC");
?>
<!DOCTYPE html>
<html lang="ca">
<head>
    <style>
        body { background: #121212; color: #e0e0e0; font-family: sans-serif; padding: 40px; }
        table { width: 100%; border-collapse: collapse; background: #1e1e1e; }
        th, td { padding: 12px; border: 1px solid #333; text-align: left; }
        th { background: #252525; color: #00ff88; }
        tr:hover { background: #2a2a2a; }
        .btn-del { color: #ff5555; text-decoration: none; font-weight: bold; }
        input { background: #333; color: white; border: 1px solid #555; padding: 5px; width: 60px; }
    </style>
</head>
<body>
    <h1>XatarraCloud - Admin DB</h1>
    <table>
        <tr>
            <th>VMID (Editar)</th>
            <th>Owner</th>
            <th>Subdomain</th>
            <th>Node IP</th>
            <th>Accions</th>
        </tr>
        <?php while($row = $res->fetch_assoc()): ?>
        <tr>
            <td>
                <form method="POST" style="display:inline;">
                    <input type="hidden" name="old_vmid" value="<?php echo $row['vmid']; ?>">
                    <input type="number" name="new_vmid" value="<?php echo $row['vmid']; ?>">
                    <button type="submit" name="edit_vmid" style="cursor:pointer;">💾</button>
                </form>
            </td>
            <td><?php echo $row['owner']; ?></td>
            <td><?php echo $row['subdomain']; ?></td>
            <td><?php echo $row['node_ip']; ?></td>
            <td><a href="?delete=<?php echo $row['vmid']; ?>" class="btn-del" onclick="return confirm('Segur que vols eliminar-lo de la DB?')">ELIMINAR</a></td>
        </tr>
        <?php endwhile; ?>
    </table>
</body>
</html>
