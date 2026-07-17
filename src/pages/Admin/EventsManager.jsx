// src/pages/Admin/EventsManager.jsx
import React, { useState, useEffect } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import {
  LuPlus,
  LuTrash2,
  LuCalendar,
  LuMapPin,
  LuImage,
  LuX,
  LuClock,
} from "react-icons/lu";

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    imageFile: null,
    imagePreview: null,
  });

  const fetchEvents = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.EVENTS.GET_UPCOMING);
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
      toast.error("Failed to fetch upcoming events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const saveToast = toast.loading("Creating event...");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("date", formData.date);
      payload.append("location", formData.location);
      if (formData.imageFile) {
        payload.append("images", formData.imageFile);
      }

      await axiosInstance.post(API_PATHS.EVENTS.CREATE, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event scheduled successfully!", { id: saveToast });
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        imageFile: null,
        imagePreview: null,
      });
      fetchEvents();
    } catch (error) {
      console.error("Failed to create event", error);
      const errMsg = error.response?.data?.message || "Error creating event";
      toast.error(errMsg, { id: saveToast });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    )
      return;

    const deleteToast = toast.loading("Deleting event...");
    try {
      await axiosInstance.delete(API_PATHS.EVENTS.DELETE(id));
      toast.success("Event deleted", { id: deleteToast });
      setEvents(events.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
      toast.error("Failed to delete event", { id: deleteToast });
    }
  };

  return (
    <DashboardLayout activeMenu="Upcoming Events">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-5 mb-6 w-auto sm:max-w-225 mx-auto">
        <div>
          <h2 className="text-2xl font-semibold">
            Event Scheduler
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Create Upcoming Events.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          <LuPlus className="text-lg" /> Schedule Event
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 overflow-hidden flex flex-col"
          >
            {event.coverImageUrl ? (
              <img
                src={event.coverImageUrl}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-50 flex items-center justify-center border-b">
                <LuImage className="text-gray-300 w-12 h-12" />
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-semibold text-gray-950 text-base line-clamp-1">
                {event.title}
              </h3>
              <p className="text-sky-500 text-xs font-semibold flex items-center gap-1.5 mt-2">
                <LuCalendar />{" "}
                {moment(event.date).format("MMM Do YYYY, h:mm a")}
              </p>
              {event.location && (
                <p className="text-gray-400 text-xs font-medium flex items-center gap-1.5 mt-1">
                  <LuMapPin /> {event.location}
                </p>
              )}
              <p className="text-gray-600 text-sm mt-3 line-clamp-3 flex-1 leading-relaxed">
                {event.description}
              </p>

              <button
                onClick={() => handleDelete(event.id)}
                className="mt-5 text-red-500 bg-red-50 hover:bg-red-100 font-medium px-3 py-2 rounded-xl flex items-center gap-2 text-xs w-full justify-center transition cursor-pointer"
              >
                <LuTrash2 className="text-sm" /> Force Cancel Event
              </button>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 font-medium">
              No scheduled events active right now.
            </p>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <LuX className="text-2xl" />
            </button>

            {/* Form Column */}
            <div>
              <h3 className="text-lg font-bold text-gray-950 mb-5">
                Create New Event
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    placeholder="E.g., Virtual Hackathon Session"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <input
                      required
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-sky-500 transition"
                      placeholder="E.g., Abuja, FCT"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    placeholder="Provide context, details, and schedules..."
                  ></textarea>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Poster Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 text-gray-600 bg-gray-100 font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 text-white bg-sky-500 font-semibold rounded-xl hover:bg-sky-600 transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Publishing..." : "Publish Event"}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/60 hidden md:flex flex-col justify-center">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Card Preview
              </h4>
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400">
                    <LuImage className="w-10 h-10" />
                  </div>
                )}
                <div className="p-5 text-sm">
                  <h3 className="font-bold text-base text-gray-950 line-clamp-1">
                    {formData.title || "Untitled Live Event"}
                  </h3>
                  <div className="text-sky-500 text-xs font-semibold flex items-center gap-1 mt-2">
                    <LuCalendar className="w-3.5 h-3.5" />{" "}
                    {formData.date
                      ? moment(formData.date).format("MMM Do YYYY, h:mm a")
                      : "Schedule Date & Time"}
                  </div>
                  <div className="text-gray-400 text-xs font-medium flex items-center gap-1 mt-1">
                    <LuMapPin className="w-3.5 h-3.5" />{" "}
                    {formData.location || "Online/TBD"}
                  </div>
                  <p className="text-gray-600 text-xs mt-3 line-clamp-3 leading-relaxed">
                    {formData.description ||
                      "Your structured content will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EventsManager;
