import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import server from "../../../Environment.js";
const server_url = server;
import "./issue.css"
const AllIssues = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [Issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [repositoryName, setRepositoryName] = useState("");

    useEffect(() => {
        const viewallissues = async () => {
            try {
                setLoading(true);
                const result = await fetch(`${server_url}/issue/repo/${id}`);
                const data = await result.json();
                
                if (!data || !data.issues || data.issues.length === 0) {
                    setIssues([]);
                } else {
                    setIssues(data.issues);
                }
                
                // Optional: Fetch repository name for better context
                try {
                    const repoResult = await fetch(`${server_url}/repo/${id}`);
                    const repoData = await repoResult.json();
                    if (repoData.repository) {
                        setRepositoryName(repoData.repository.name);
                    }
                } catch (err) {
                    console.log("Could not fetch repository name:", err);
                }
                
            } catch (err) {
                console.log(err);
                alert("Error finding issues for this repository");
            } finally {
                setLoading(false);
            }
        }
        viewallissues();
    }, [id, navigate]);

    const handleBackToRepo = () => {
        navigate(`/repository/${id}`);
    };

    const handleCreateIssue = () => {
        navigate(`/issue/create/${id}`);
    };

    if (loading) {
        return (
            <div className="issues-container">
                <div className="loading-spinner">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                    <p>Loading issues...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="issues-container">
            <div className="issues-header">
                <button className="btn-back" onClick={handleBackToRepo}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Repository
                </button>
                
                <div className="header-content">
                    <div className="header-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <h1>Issues</h1>
                    </div>
                    {repositoryName && (
                        <p className="repo-name">Repository: {repositoryName}</p>
                    )}
                </div>

                <div className="header-actions">
                    <button className="btn-create" onClick={handleCreateIssue}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Create Issue
                    </button>
                </div>
            </div>

            <div className="issues-content">
                {Issues.length === 0 ? (
                    <div className="no-issues">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                            <line x1="9" y1="9" x2="9.01" y2="9"/>
                            <line x1="15" y1="9" x2="15.01" y2="9"/>
                        </svg>
                        <h3>No Issues Found</h3>
                        <p>This repository doesn't have any issues yet.</p>
                        <button className="btn-create-primary" onClick={handleCreateIssue}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Create First Issue
                        </button>
                    </div>
                ) : (
                    <div className="issues-grid">
                        {Issues.map((issue, index) => (
                            <div key={issue._id} className="issue-card">
                                <div className="issue-header">
                                    <div className="issue-number">#{index + 1}</div>
                                    <div className="issue-status">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="12" y1="8" x2="12" y2="12"/>
                                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                                        </svg>
                                        Open
                                    </div>
                                </div>
                                
                                <div className="issue-content">
                                    <h3 className="issue-title">{issue.title}</h3>
                                    {issue.description && (
                                        <p className="issue-description">
                                            {issue.description.length > 100 
                                                ? `${issue.description.substring(0, 100)}...` 
                                                : issue.description}
                                        </p>
                                    )}
                                </div>

                                <div className="issue-footer">
                                    <div className="issue-meta">
                                        {issue.createdAt && (
                                            <span className="issue-date">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <polyline points="12 6 12 12 16 14"/>
                                                </svg>
                                                {new Date(issue.createdAt).toLocaleDateString()}
                                            </span>
                                        )}
                                        {issue.author && (
                                            <span className="issue-author">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                    <circle cx="12" cy="7" r="4"/>
                                                </svg>
                                                {issue.author.username || issue.author.name || 'Unknown'}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <button 
                                        className="btn-view-issue"
                                        onClick={() => navigate(`/issue/${issue._id}`)}
                                    >
                                        View Issue
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 18l6-6-6-6"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllIssues;