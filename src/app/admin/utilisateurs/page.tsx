"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, Edit2, Trash2, Shield, X, AlertCircle, Mail, CheckCircle2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createUser, updateUser, deleteUser, getUsersWithStatus, resendInvitation } from "@/app/actions/admin";
import type { Profile } from "@/types/admin";

type ProfileWithStatus = Profile & { 
  confirmed_at?: string | null;
  requires_password_update?: boolean;
};

export default function UtilisateursAdminPage() {
  const [users, setUsers] = useState<ProfileWithStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<ProfileWithStatus> | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "ADMIN" as "SUPER_ADMIN" | "ADMIN"
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsersWithStatus();
      setUsers(data as ProfileWithStatus[]);
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors du chargement des utilisateurs.");
    }
    setLoading(false);
  };

  const handleOpenModal = (user?: ProfileWithStatus) => {
    setError(null);
    setSuccess(null);
    if (user) {
      setCurrentUser(user);
      setFormData({
        email: user.email,
        password: "", // Password isn't fetched, left blank for edit
        full_name: user.full_name || "",
        role: user.role
      });
    } else {
      setCurrentUser(null);
      setFormData({
        email: "",
        password: "",
        full_name: "",
        role: "ADMIN"
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenDelete = (user: ProfileWithStatus) => {
    setError(null);
    setSuccess(null);
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (currentUser?.id) {
        // Edit mode
        await updateUser(currentUser.id, formData);
      } else {
        // Create mode (invitation)
        await createUser(formData);
      }
      await fetchUsers();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser?.id) return;
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await deleteUser(currentUser.id);
      await fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Impossible de supprimer cet utilisateur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendInvite = async (email: string) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await resendInvitation(email);
      setSuccess(`Invitation renvoyée à ${email}`);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi de l'invitation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.full_name && u.full_name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Gestion des utilisateurs"
        description="Gérez les accès et rôles de l'administration"
      />

      <div className="flex-1 p-4 md:p-6 max-w-7xl">
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span className="font-medium">{success}</span>
          </div>
        )}
        {error && !isModalOpen && !isDeleteModalOpen && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-primary-hover transition-colors font-semibold text-sm w-full sm:w-auto justify-center"
          >
            <UserPlus size={16} />
            Nouvel utilisateur
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Statut & Rôle</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      Chargement des utilisateurs...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">{user.full_name}</span>
                          <span className="text-slate-500 text-xs">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 items-start">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/5 text-primary">
                            <Shield size={12} />
                            {user.role}
                          </div>
                          {user.confirmed_at && user.requires_password_update !== true ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                              <CheckCircle2 size={12} />
                              E-mail confirmé
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                              <Mail size={12} />
                              Invitation envoyée
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {(!user.confirmed_at || user.requires_password_update === true) && (
                            <button
                              onClick={() => handleResendInvite(user.email)}
                              disabled={isSubmitting}
                              className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                              aria-label="Renvoyer l'invitation"
                            >
                              <Mail size={14} className="inline-block mr-1.5" />
                              Renvoyer l'invitation
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            aria-label="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(user)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-primary">
                {currentUser?.id ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-primary transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2 border border-red-100">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {!currentUser?.id && (
                <div className="mb-6 p-4 bg-blue-50 text-blue-700 text-sm rounded-xl flex items-start gap-3 border border-blue-100">
                  <Mail size={20} className="shrink-0 mt-0.5 text-blue-500" />
                  <p>Un e-mail d'invitation sera envoyé à cette adresse. L'utilisateur devra cliquer sur le lien pour confirmer son e-mail et définir son propre mot de passe.</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    disabled={!!currentUser?.id}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-sm disabled:opacity-50"
                  />
                </div>
                
                {currentUser?.id && (
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">
                      Nouveau mot de passe (laisser vide pour ne pas modifier)
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-sm"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Rôle</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-sm"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Enregistrement..." : (currentUser?.id ? "Mettre à jour" : "Envoyer l'invitation")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="font-bold text-lg text-primary mb-2">Confirmer la suppression</h3>
              <p className="text-slate-500 text-sm mb-6">
                Êtes-vous sûr de vouloir supprimer l'utilisateur <strong className="text-primary">{currentUser?.full_name}</strong> ? Cette action est irréversible.
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-left border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold text-sm rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
