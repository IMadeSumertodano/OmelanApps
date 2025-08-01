import fetchWithAuth from "./fetchwithauth.js";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchAllCaregivers() {
  try {
    const res = await fetch(`${API_URL}/list/partner`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal mengambil data caregiver");
    }
    const DPartner = await res.json();
    return DPartner.data.list;
  } catch (error) {
    // Lempar error agar bisa ditangani oleh komponen UI
    throw error;
  }
}

export async function searchCaregiversByDateAvailableDB(date) {
  const payload = {
    dateStart: date,
    dateEnd: date,
  };

  const DListCaregiver = await fetchWithAuth(`${API_URL}/schedule/findByDate`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return DListCaregiver;
}

export async function getAppointmentsByPartner() {
  const result = await fetchWithAuth(`${API_URL}/appointments/partner`);
  return result.data.appointments;
}

export async function getAppointmentsByClient() {
  const result = await fetchWithAuth(`${API_URL}/appointments/client`);

  return result.data.appointments;
}

export async function updateAppointmentStatus(id, status) {
  const result = await fetchWithAuth(`${API_URL}/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return result;
}

export async function getUserProfile(role) {
  let endpoint = "";

  if (role === "caregiver") {
    endpoint = "/details/partner";
  } else if (role === "caretaker") {
    endpoint = "/details/client";
  } else {
    throw new Error("Role tidak valid atau tidak dikenali.");
  }

  const response = await fetchWithAuth(`${API_URL}${endpoint}`);
  // console.log(response);
  console.log(response);

  return response.data.details;
}

export async function updateUserProfile(role, payload) {
  let endpoint = "";

  if (role === "caregiver") {
    endpoint = "/details/partner";
  } else if (role === "caretaker") {
    endpoint = "/details/client";
  } else {
    throw new Error("Role tidak valid atau tidak dikenali.");
  }

  const res = await fetchWithAuth(`${API_URL}${endpoint}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return res;
}

export async function uploadPhoto(file) {
  const token = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("photo", file);

  try {
    const res = await fetch(`${API_URL}/user/upload/photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));

      throw new Error(errorData.message || "Gagal upload foto");
    }

    const result = await res.json();

    return result;
  } catch (err) {
    throw err;
  }
}

export async function fetchSchedules() {
  const result = await fetchWithAuth(`${API_URL}/schedule/partner`);

  // console.log(result);

  return result.data.schedules;
}

export async function submitSchedule(date) {
  try {
    const result = await fetchWithAuth(`${API_URL}/schedule/partner`, {
      method: "POST",
      body: JSON.stringify({
        dateStart: date,
        dateEnd: date,
      }),
    });

    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteSchedule(id) {
  const res = await fetchWithAuth(`${API_URL}/schedule/partner/${id}`, {
    method: "DELETE",
  });

  return true;
}

export async function getReviewsForPartner() {
  const result = await fetchWithAuth(`${API_URL}/reviews/partner`);
  return result.data.reviews;
}

export async function getReviewSummaryForClient() {
  const result = await fetchWithAuth(`${API_URL}/reviews/client/summary`);
  return result.data.reviews;
}

export async function updateReview({ appointmentId, rating, comment }) {
  const result = await fetchWithAuth(`${API_URL}/reviews`, {
    method: "PATCH",
    body: JSON.stringify({ appointmentId, rating, comment }),
  });

  return result;
}

export const getAllNotifications = async (type = "client") => {
  const url = `${API_URL}/notifications/${type}/all`;
  const response = await fetchWithAuth(url, { method: "GET" });
  return response.data.notifications;
};

export const getUnreadNotifications = async (type = "client") => {
  const url = `${API_URL}/notifications/${type}/unread`;
  const response = await fetchWithAuth(url, { method: "GET" });
  return response.data.notifications;
};

export const getNotificationDetail = async (id, type = "client") => {
  const url = `${API_URL}/notifications/${type}/${id}`;
  const response = await fetchWithAuth(url, { method: "GET" });
  return response.data.content;
};

export const markNotificationAsRead = async (id, type = "client") => {
  const url = `${API_URL}/notifications/${type}/${id}`;
  await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify({ statusRead: "Y" }),
  });
};
