import api from './api';

export const appointmentService = {
  /**
   * Mengambil semua data appointments (Admin)
   * Diurutkan berdasarkan tanggal appointment descending
   */
  getAllAppointments: async () => {
    const response = await api.get('/appointments?order=appointment_date.desc');
    return response.data;
  },

  /**
   * Mengambil appointments berdasarkan customer_id (Member)
   */
  getAppointmentsByCustomerId: async (customerId) => {
    const response = await api.get(`/appointments?customer_id=eq.${customerId}&order=appointment_date.desc`);
    return response.data;
  },

  /**
   * Mengambil appointments berdasarkan user_id (Admin)
   */
  getAppointmentsByUserId: async (userId) => {
    const response = await api.get(`/appointments?user_id=eq.${userId}&order=appointment_date.desc`);
    return response.data;
  },

  /**
   * Mengambil appointment berdasarkan ID
   */
  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments?id=eq.${id}`);
    return response.data[0] || null;
  },

  /**
   * Membuat appointment baru
   * @param {Object} data - { customer_id, service_id, patient_name, appointment_date, appointment_time, doctor_name, source, notes }
   */
  createAppointment: async (data) => {
    const response = await api.post('/appointments', {
      customer_id: data.customer_id || null,
      service_id: data.service_id || null,
      patient_name: data.patient_name,
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time || null,
      doctor_name: data.doctor_name || null,
      status: 'scheduled',
      source: data.source || 'guest',
      notes: data.notes || ''
    });
    return response.data;
  },

  /**
   * Update status appointment
   * @param {number} id - ID appointment
   * @param {string} status - 'scheduled' | 'completed' | 'cancelled' | 'no_show'
   */
  updateAppointmentStatus: async (id, status) => {
    const response = await api.patch(`/appointments?id=eq.${id}`, { status });
    return response.data;
  },

  /**
   * Update data appointment
   * @param {number} id - ID appointment
   * @param {Object} data - Field yang ingin diupdate
   */
  updateAppointment: async (id, data) => {
    const response = await api.patch(`/appointments?id=eq.${id}`, data);
    return response.data;
  },

  /**
   * Menghapus appointment
   */
  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments?id=eq.${id}`);
    return response.data;
  },

  /**
   * Mengambil appointments dalam rentang tanggal tertentu
   */
  getAppointmentsByDateRange: async (startDate, endDate) => {
    const response = await api.get(
      `/appointments?appointment_date=gte.${startDate}&appointment_date=lte.${endDate}&order=appointment_date.asc`
    );
    return response.data;
  }
};
