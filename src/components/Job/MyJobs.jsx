import axios from "axios";
import React, { useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

// Utility function for API calls
const makeApiCall = async (url, method, data = null) => {
  try {
    const config = {
      method,
      url,
      data,
      withCredentials: true,
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred");
    throw error;
  }
};

// JobCard component
const JobCard = ({
  job,
  isEditing,
  onEditEnable,
  onEditDisable,
  onUpdate,
  onDelete,
  onInputChange,
}) => {
  return (
    <div className="card" key={job._id}>
      <div className="content">
        <div className="short_fields">
          <div>
            <span>Title:</span>
            <input
              type="text"
              disabled={!isEditing}
              value={job.title}
              onChange={(e) => onInputChange(job._id, "title", e.target.value)}
            />
          </div>
          <div>
            <span>Country:</span>
            <input
              type="text"
              disabled={!isEditing}
              value={job.country}
              onChange={(e) =>
                onInputChange(job._id, "country", e.target.value)
              }
            />
          </div>
          <div>
            <span>City:</span>
            <input
              type="text"
              disabled={!isEditing}
              value={job.city}
              onChange={(e) => onInputChange(job._id, "city", e.target.value)}
            />
          </div>
          <div>
            <span>Category:</span>
            <select
              value={job.category}
              onChange={(e) =>
                onInputChange(job._id, "category", e.target.value)
              }
              disabled={!isEditing}
            >
              <option value="Graphics & Design">Graphics & Design</option>
              <option value="Mobile App Development">
                Mobile App Development
              </option>
              <option value="Frontend Web Development">
                Frontend Web Development
              </option>
              <option value="MERN Stack Development">MERN STACK Development</option>
              <option value="Account & Finance">Account & Finance</option>
              <option value="Artificial Intelligence">
                Artificial Intelligence
              </option>
              <option value="Video Animation">Video Animation</option>
              <option value="MEAN Stack Development">MEAN STACK Development</option>
              <option value="MEVN Stack Development">MEVN STACK Development</option>
              <option value="Data Entry Operator">Data Entry Operator</option>
            </select>
          </div>
          <div>
            <span>
              Salary:{" "}
              {job.fixedSalary ? (
                <input
                  type="number"
                  disabled={!isEditing}
                  value={job.fixedSalary}
                  onChange={(e) =>
                    onInputChange(job._id, "fixedSalary", e.target.value)
                  }
                />
              ) : (
                <div>
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={job.salaryFrom}
                    onChange={(e) =>
                      onInputChange(job._id, "salaryFrom", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={job.salaryTo}
                    onChange={(e) =>
                      onInputChange(job._id, "salaryTo", e.target.value)
                    }
                  />
                </div>
              )}
            </span>
          </div>
          <div>
            <span>Expired:</span>
            <select
              value={job.expired}
              onChange={(e) =>
                onInputChange(job._id, "expired", e.target.value)
              }
              disabled={!isEditing}
            >
              <option value={true}>TRUE</option>
              <option value={false}>FALSE</option>
            </select>
          </div>
        </div>
        <div className="long_field">
          <div>
            <span>Description:</span>{" "}
            <textarea
              rows={5}
              value={job.description}
              disabled={!isEditing}
              onChange={(e) =>
                onInputChange(job._id, "description", e.target.value)
              }
            />
          </div>
          <div>
            <span>Location: </span>
            <textarea
              value={job.location}
              rows={5}
              disabled={!isEditing}
              onChange={(e) =>
                onInputChange(job._id, "location", e.target.value)
              }
            />
          </div>
        </div>
      </div>
      <div className="button_wrapper">
        <div className="edit_btn_wrapper">
          {isEditing ? (
            <>
              <button
                onClick={() => onUpdate(job._id)}
                className="check_btn"
              >
                <FaCheck />
              </button>
              <button
                onClick={onEditDisable}
                className="cross_btn"
              >
                <RxCross2 />
              </button>
            </>
          ) : (
            <button
              onClick={() => onEditEnable(job._id)}
              className="edit_btn"
            >
              Edit
            </button>
          )}
        </div>
        <button
          onClick={() => onDelete(job._id)}
          className="delete_btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();

  // Fetching all jobs
  const fetchJobs = useCallback(async () => {
    try {
      const data = await makeApiCall(
        "http://localhost:4000/api/v1/job/getmyjobs",
        "get"
      );
      setMyJobs(data.myJobs);
    } catch {
      setMyJobs([]);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  // Function For Enabling Editing Mode
  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  // Function For Disabling Editing Mode
  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  // Function For Updating The Job
  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    try {
      const data = await makeApiCall(
        `http://localhost:4000/api/v1/job/update/${jobId}`,
        "put",
        updatedJob
      );
      toast.success(data.message);
      setEditingMode(null);
    } catch {}
  };

  // Function For Deleting Job
  const handleDeleteJob = async (jobId) => {
    try {
      const data = await makeApiCall(
        `http://localhost:4000/api/v1/job/delete/${jobId}`,
        "delete"
      );
      toast.success(data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch {}
  };

  const handleInputChange = useCallback((jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  }, []);

  return (
    <div className="myJobs page">
      <div className="container">
        <h1>Your Posted Jobs</h1>
        {myJobs.length > 0 ? (
          <div className="banner">
            {myJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isEditing={editingMode === job._id}
                onEditEnable={handleEnableEdit}
                onEditDisable={handleDisableEdit}
                onUpdate={handleUpdateJob}
                onDelete={handleDeleteJob}
                onInputChange={handleInputChange}
              />
            ))}
          </div>
        ) : (
          <p>
            You've not posted any job or maybe you deleted all of your jobs!
          </p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
