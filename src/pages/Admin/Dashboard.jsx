// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

import {
  LuChartLine,
  LuCheckCheck,
  LuGalleryHorizontalEnd,
  LuHeart,
} from "react-icons/lu";

import DashboardSummaryCard from "../../components/Cards/DashboardSummaryCard";
import TagInsights from "../../components/Cards/TagInsights";
import TopPostCard from "../../components/Cards/TopPostCard";
import RecentCommentsList from "../../components/Cards/RecentCommentsList";

const Dashboard = () => {
  const navigate = useNavigate();

  // Pull the authenticated user from Redux
  const user = useSelector((state) => state.auth.user);

  const [dashboardData, setDashboardData] = useState(null);
  const [maxViews, setMaxViews] = useState(0);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.DASHBOARD.GET_DASHBOARD_DATA
      );

      if (response.data) {
        setDashboardData(response.data);

        const topPosts = response.data.topPosts || [];
        const highestView = Math.max(...topPosts.map((p) => p.views), 1);
        setMaxViews(highestView);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    // If there's no authenticated user, redirect to login
    if (!user) {
      return navigate("/login");
    }

    getDashboardData();
  }, [user, navigate]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {dashboardData && (
        <>
          {/* Greeting & Date */}
          <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 mt-5">
            <div>
              <h2 className="text-xl md:text-2xl font-medium">
                Good Day! {user.name}
              </h2>
              <p className="text-xs md:text-[13px] font-medium text-gray-400 mt-1.5">
                {moment().format("dddd MMM YYYY")}
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <DashboardSummaryCard
                icon={<LuGalleryHorizontalEnd />}
                label="Total Posts"
                value={dashboardData.stats.totalPosts || 0}
                bgColor="bg-sky-100/60"
                color="text-sky-500"
              />

              <DashboardSummaryCard
                icon={<LuCheckCheck />}
                label="Published"
                value={dashboardData.stats.published || 0}
                bgColor="bg-sky-100/60"
                color="text-sky-500"
              />

              <DashboardSummaryCard
                icon={<LuChartLine />}
                label="Total Views"
                value={dashboardData.stats.totalViews || 0}
                bgColor="bg-sky-100/60"
                color="text-sky-500"
              />

              <DashboardSummaryCard
                icon={<LuHeart />}
                label="Total Likes"
                value={dashboardData.stats.totalLikes || 0}
                bgColor="bg-sky-100/60"
                color="text-sky-500"
              />
            </div>
          </div>

          {/* Tag Insights, Top Posts, Recent Comments */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-6">
            <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
              <h5 className="font-medium mb-4">Tag Insights</h5>
              <TagInsights tagUsage={dashboardData.tagUsage || []} />
            </div>

            <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
              <h5 className="font-medium mb-4">Top Posts</h5>
              {dashboardData.topPosts.slice(0, 3).map((post) => (
                <TopPostCard
                  key={post._id}
                  title={post.title}
                  coverImageUrl={post.coverImageUrl}
                  views={post.views}
                  likes={post.likes}
                  maxViews={maxViews}
                />
              ))}
            </div>

            <div className="col-span-12 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
              <h5 className="font-medium mb-4">Recent Comments</h5>
              <RecentCommentsList
                comments={dashboardData.recentComments || []}
              />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
