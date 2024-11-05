import ExternalApi from "./ExternalApi";

export const TASK_URL = "/task";

export const ACCESS_TOKEN_KEY = "accessToken";
export const USER_INFO_KEY = "userInfo";
export const USER_PERMISSION_KEY = "userPermission";

export async function createTask(data) {
  return ExternalApi.post(TASK_URL, { ...data }).then(async (res) => res?.data);
}

export async function getAllTasks() {
  return ExternalApi.get(TASK_URL).then((res) => {
    return res.data;
  });
}
export async function deleteTask(id) {
  return ExternalApi.delete(`${TASK_URL}/${id}`).then((res) => {
    async (res) => res?.data;
  });
}

export async function updateTask(data, id) {
  return ExternalApi.put(`${TASK_URL}/${id}`, { data }).then((res) => {
    async (res) => res?.data;
  });
}
export async function updateTaskStatus(data, id) {
  return ExternalApi.patch(`${TASK_URL}/${id}`, { status: data }).then(
    (res) => {
      async (res) => res?.data;
    }
  );
}
