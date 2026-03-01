<?php
namespace App\controllers;

use App\models\PrimeNgData;

class PrimeNgDataController {
    private $model;

    public function __construct(\PDO $pdo) {
        $this->model = new PrimeNgData($pdo);
    }

    public function index() {
        echo json_encode($this->model->findAll());
    }

    public function show($id) {
        $item = $this->model->findOne($id);
        if ($item) {
            echo json_encode($item);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
        }
    }

    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        $data = $this->sanitize($data);
        $item = $this->model->create($data);
        http_response_code(201);
        echo json_encode($item);
    }

    public function update($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $data = $this->sanitize($data);
        $item = $this->model->update($id, $data);
        echo json_encode($item);
    }

    public function destroy($id) {
        $success = $this->model->delete($id);
        echo json_encode(['deleted' => $success]);
    }

    private function sanitize($data) {
        // Basic sanitization for title and description
        $data['title'] = isset($data['title']) ? strip_tags(trim($data['title'])) : '';
        $data['description'] = isset($data['description']) ? strip_tags(trim($data['description'])) : '';
        $data['published'] = isset($data['published']) ? (int)!!$data['published'] : 0;
        return $data;
    }
}
