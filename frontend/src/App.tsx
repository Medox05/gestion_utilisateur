import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import UsersPage from "./pages/UsersPage";
import UserFormPage from "./pages/UserFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/create" element={<UserFormPage mode="create" />} />
          <Route path="/users/:id/edit" element={<UserFormPage mode="edit" />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  );
}