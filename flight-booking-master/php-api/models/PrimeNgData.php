<?php
namespace App\models;

class PrimeNgData {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function findAll() {
        $stmt = $this->pdo->query("SELECT * FROM primeNgData ORDER BY id DESC");
        return $stmt->fetchAll();
    }

    public function findOne($id) {
        if (!is_numeric($id)) return false;
        $stmt = $this->pdo->prepare("SELECT * FROM primeNgData WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $now = date('Y-m-d H:i:s');
        $stmt = $this->pdo->prepare("INSERT INTO primeNgData (title, description, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'] ?? '',
            $data['description'] ?? '',
            $data['published'] ?? 0,
            $now,
            $now
        ]);
        return $this->findOne($this->pdo->lastInsertId());
    }

    public function update($id, $data) {
        if (!is_numeric($id)) return false;
        $now = date('Y-m-d H:i:s');
        $stmt = $this->pdo->prepare("UPDATE primeNgData SET title = ?, description = ?, published = ?, updatedAt = ? WHERE id = ?");
        $stmt->execute([
            $data['title'] ?? '',
            $data['description'] ?? '',
            $data['published'] ?? 0,
            $now,
            $id
        ]);
        return $this->findOne($id);
    }

    public function delete($id) {
        if (!is_numeric($id)) return false;
        $stmt = $this->pdo->prepare("DELETE FROM primeNgData WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
