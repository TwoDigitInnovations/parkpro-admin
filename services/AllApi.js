
import { Api } from "@/services/service";

export const ParkingAPI = {
  getAll: (router) => Api("get", "parking/getParking", "", router),
  getOne: (id, router) => Api("get", `parking/getSingleParking/${id}`, "", router),
  create: (data, router) => Api("post", "parking/CreateParking", data, router),
  update: (id, data, router) => Api("put", `parking/updateParking/${id}`, data, router),
  delete: (id, router) => Api("delete", `parking/deleteParking/${id}`, "", router),

  addSlot: (id, data, router) => Api("post", `parking/addSlot/${id}`, data, router),
  removeSlot: (id, slotId, router) =>
    Api("delete", `parking/removeSlot/${id}/${slotId}`, "", router),

  setMachine: (id, data, router) => Api("post", `parking/setMachine/${id}`, data, router),
  removeMachine: (id, router) =>
    Api("delete", `parking/removeMachine/${id}`, "", router),
};
