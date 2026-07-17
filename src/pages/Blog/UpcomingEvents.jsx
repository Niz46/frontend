// src/pages/Blog/UpcomingEvents.jsx
import React, { useEffect, useState } from "react";
import moment from "moment";
import { LuCalendar, LuMapPin, LuClock, LuCalendarX } from "react-icons/lu";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axiosInstance.get(API_PATHS.EVENTS.GET_UPCOMING);
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <BlogLayout activeMenu="Upcoming Events">
      <div className="max-w-6xl mx-auto pb-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Upcoming Events
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Stay connected with our scheduled activities, community journals,
            and local gatherings.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 max-w-lg mx-auto">
            <LuCalendarX className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-950">
              No Scheduled Events
            </h3>
            <p className="text-gray-500 text-sm mt-2 px-6">
              There are no upcoming events listed at the moment. Please check
              back later or contact us for more details!
            </p>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                {event.coverImageUrl ? (
                  <img
                    src={event.coverImageUrl}
                    alt={event.title}
                    className="w-full h-52 object-cover"
                  />
                ) : (
                  <div className="w-full h-52 bg-linear-to-br from-sky-50 to-indigo-50 flex items-center justify-center">
                    <LuCalendar className="w-14 h-14 text-sky-200" />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Title and Date Badge */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center bg-sky-50 text-sky-600 rounded-xl px-3 py-2 min-w-16.25 text-center border border-sky-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {moment(event.date).format("MMM")}
                      </span>
                      <span className="text-2xl font-black leading-none mt-1">
                        {moment(event.date).format("DD")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2.5 my-5 pt-4 border-t border-gray-100 text-[13.5px] text-gray-600">
                    <div className="flex items-center gap-2.5">
                      <LuClock className="text-sky-500 w-4 h-4 shrink-0" />
                      <span>{moment(event.date).format("h:mm A (dddd)")}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2.5">
                        <LuMapPin className="text-sky-500 w-4 h-4 shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-[14px] leading-relaxed line-clamp-4 flex-1">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default UpcomingEvents;
