import { types } from "mobx-state-tree";

const WeatherStore = types
  .model("WeatherStore", {
    place: types.optional(types.string, "Republic of India"),
    loadingCity: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setPlace(newPlace: string) {
      self.place = newPlace;
    },
    setLoadingCity(loading: boolean) {
      self.loadingCity = loading;
    },
  }));

export default WeatherStore;
