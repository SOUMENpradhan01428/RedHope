const API_BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => {
  const h = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};

const handleResponse = async (res) => {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const errorMsg = data && data.message ? data.message : `HTTP error ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

const api = {
  get: (url) => fetch(`${API_BASE}${url}`, { headers: headers() }).then(handleResponse),
  post: (url, body) =>
    fetch(`${API_BASE}${url}`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then(handleResponse),
  put: (url, body) =>
    fetch(`${API_BASE}${url}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) }).then(handleResponse),
  delete: (url) =>
    fetch(`${API_BASE}${url}`, { method: "DELETE", headers: headers() }).then(handleResponse),
};

// Auth
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
  changePassword: (currentPassword, newPassword) => api.put("/auth/change-password", { currentPassword, newPassword }),
};

// Donor
export const donorAPI = {
  getDashboard: () => api.get("/donor/dashboard"),
  getProgress: () => api.get("/donor/progress"),
  getUrgentRequests: () => api.get("/donor/urgent-requests"),
  respondToRequest: (id) => api.post(`/donor/respond-request/${id}`),
  completeDonation: (data) => api.post("/donor/complete-donation", data),
  getDonations: () => api.get("/donor/donations"),
  checkEligibility: () => api.get("/donor/eligibility"),
  getCamps: () => api.get("/donor/camps"),
  applyForCamp: (id, healthDetails) => api.post(`/donor/camps/${id}/apply`, healthDetails),
  getRegisteredCamps: () => api.get("/donor/camps/registered"),
  getRewards: () => api.get("/donor/rewards"),
  redeemReward: (id) => api.post(`/donor/rewards/${id}/redeem`),
  getLeaderboard: () => api.get("/donor/leaderboard"),
  getProfile: () => api.get("/donor/profile"),
  updateProfile: (data) => api.put("/donor/profile", data),
  submitCampCompletion: (id, data) => api.post(`/donor/camps/${id}/complete`, data),
};

// Hospital
export const hospitalAPI = {
  getDashboard: () => api.get("/hospital/dashboard"),
  getBloodStock: () => api.get("/hospital/blood-stock"),
  updateBloodStock: (data) => api.put("/hospital/blood-stock", data),
  getLowStockAlerts: () => api.get("/hospital/low-stock-alerts"),
  createBloodRequest: (data) => api.post("/hospital/blood-request", data),
  getMyRequests: () => api.get("/hospital/my-requests"),
  updateRequestStatus: (id, status) => api.put(`/hospital/requests/${id}/status`, { status }),
  confirmDonation: (data) => api.post("/hospital/confirm-donation", data),
  getWeeklyCollection: () => api.get("/hospital/weekly-collection"),
  getBloodTypeDistribution: () => api.get("/hospital/blood-type-distribution"),
  getProfile: () => api.get("/hospital/profile"),
  updateProfile: (data) => api.put("/hospital/profile", data),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: (params = "") => api.get(`/admin/users?${params}`),
  getUserDetail: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPendingHospitals: () => api.get("/admin/hospitals/pending"),
  updateHospitalStatus: (id, status) => api.put(`/admin/hospitals/${id}/status`, { status }),
  getDonationTrends: () => api.get("/admin/analytics/donation-trends"),
  getUserGrowth: () => api.get("/admin/analytics/user-growth"),
  getBloodDistribution: () => api.get("/admin/analytics/blood-distribution"),
  getPeakHours: () => api.get("/admin/analytics/peak-hours"),
  getRegionalActivity: () => api.get("/admin/analytics/regional"),
  getDonationReport: (params = "") => api.get(`/admin/reports/donations?${params}`),
  getUserActivityReport: () => api.get("/admin/reports/users"),
  getHospitalReport: () => api.get("/admin/reports/hospitals"),
  getBloodTypeReport: () => api.get("/admin/reports/blood-types"),
  getRegionalReport: () => api.get("/admin/reports/regional"),
  createCamp: (data) => api.post("/admin/camps", data),
  getCamps: () => api.get("/admin/camps"),
  updateCamp: (id, data) => api.put(`/admin/camps/${id}`, data),
  deleteCamp: (id) => api.delete(`/admin/camps/${id}`),
  getPendingCampApprovals: () => api.get("/admin/camp-approvals"),
  approveCampRegistration: (id, status) => api.put(`/admin/camp-approvals/${id}/approve`, { status }),
  getRewards: () => api.get("/admin/rewards"),
  createReward: (data) => api.post("/admin/rewards", data),
  updateReward: (id, data) => api.put(`/admin/rewards/${id}`, data),
  deleteReward: (id) => api.delete(`/admin/rewards/${id}`),
  seedAnalyticsData: () => api.post("/admin/seed-analytics"),
};

// Notifications
export const notificationAPI = {
  getAll: () => api.get("/notifications"),
  markAsRead: () => api.put("/notifications/read"),
};

// Messages
export const messageAPI = {
  getConversations: () => api.get("/messages/conversations"),
  getMessages: (conversationId) => api.get(`/messages/conversations/${conversationId}`),
  sendMessage: (receiverId, content) => api.post("/messages/send", { receiverId, content }),
  getUnreadCount: () => api.get("/messages/unread-count"),
  startConversation: (userId) => api.post("/messages/start", { userId }),
};

export default api;
