import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getMembershipByStaff, updateMembership } from "../api/membershipApi";
import { getBooksByStaff, updateBookByStaff } from "../api/bookApi";
import { getAwardsByStaff, updateAward } from "../api/awardApi";
import { getPublicationsByStaff, updatePublication } from "../api/publicationApi";
import { getMyConferences, updateConference } from "../api/conferenceApi";

const EditMembership = () => {
  const { staffId } = useParams();

  // ===== TAB STATE =====
  const [activeTab, setActiveTab] = useState("memberships");

  // ===== MEMBERSHIP STATES =====
  const [memberships, setMemberships] = useState([]);
  const [selectedMembershipId, setSelectedMembershipId] = useState(null);
  const [membershipForm, setMembershipForm] = useState({
    membershipType: "",
    institution: "",
    membershipId: "",
  });

  // ===== BOOK STATES =====
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [bookForm, setBookForm] = useState({
    type: "",
    author_name: "",
    title: "",
    publisher_name: "",
    publisher_address: "",
    isbn_issn: "",
    page_from: "",
    page_to: "",
    month: "",
    year: "",
    url: "",
  });

  // ===== AWARD STATES =====
  const [awards, setAwards] = useState([]);
  const [selectedAwardId, setSelectedAwardId] = useState(null);
  const [awardForm, setAwardForm] = useState({
    awardName: "",
    awardingAgent: "",
    awardYear: "",
  });

  // ===== PUBLICATION STATES =====
  const [publications, setPublications] = useState([]);
  const [selectedPublicationId, setSelectedPublicationId] = useState(null);
  const [publicationForm, setPublicationForm] = useState({
    scope: "",
    publishedMonth: "",
    publishedYear: "",
    authors: "",
    paperTitle: "",
    journalName: "",
    volumeNumber: "",
    issueNumber: "",
    publicationYearOrDoi: "",
    pageFrom: "",
    pageTo: "",
  });

  // ===== CONFERENCE STATES =====
  const [conferences, setConferences] = useState([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState(null);
  const [conferenceForm, setConferenceForm] = useState({
    conference_type: "",
    activity_type: "",
    author_name: "",
    publication_year: "",
    paper_title: "",
    conference_title: "",
    conference_from: "",
    conference_to: "",
    location: "",
    page_from: "",
    page_to: "",
    place_of_publication: "",
    publisher: "",
  });

  // ===== SHARED STATES =====
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== LOAD MEMBERSHIPS =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMembershipByStaff(staffId);
        const list = Array.isArray(data) ? data : [data];
        setMemberships(list);
      } catch {
        setError("Failed to load memberships");
      }
    };
    if (staffId) loadData();
  }, [staffId]);

  // ===== LOAD BOOKS =====
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await getBooksByStaff(staffId);
        const list = Array.isArray(data) ? data : [data];
        setBooks(list);
      } catch {
        setError("Failed to load books");
      }
    };
    if (staffId) loadBooks();
  }, [staffId]);

  // ===== LOAD AWARDS =====
  useEffect(() => {
    const loadAwards = async () => {
      try {
        const data = await getAwardsByStaff(staffId);
        const list = Array.isArray(data) ? data : [data];
        setAwards(list);
      } catch {
        setError("Failed to load awards");
      }
    };
    if (staffId) loadAwards();
  }, [staffId]);

  // ===== LOAD PUBLICATIONS =====
  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await getPublicationsByStaff(staffId);
        const list = Array.isArray(data) ? data : [data];
        setPublications(list);
      } catch {
        setError("Failed to load publications");
      }
    };
    if (staffId) loadPublications();
  }, [staffId]);

  // ===== LOAD CONFERENCES =====
  useEffect(() => {
    const loadConferences = async () => {
      try {
        const data = await getMyConferences(staffId);
        const list = Array.isArray(data) ? data : [data];
        setConferences(list);
      } catch {
        setError("Failed to load conferences");
      }
    };
    if (staffId) loadConferences();
  }, [staffId]);

  // ===== SELECT MEMBERSHIP =====
  const selectMembership = (m) => {
    setSelectedMembershipId(m.id);
    setSelectedBookId(null);
    setSelectedAwardId(null);
    setSelectedPublicationId(null);
    setSelectedConferenceId(null);
    setMembershipForm({
      membershipType: m.membershipType || "",
      institution: m.institution || "",
      membershipId: m.membershipId || "",
    });
  };

  // ===== SELECT BOOK =====
  const selectBook = (b) => {
    setSelectedBookId(b.id);
    setSelectedMembershipId(null);
    setSelectedAwardId(null);
    setSelectedPublicationId(null);
    setSelectedConferenceId(null);
    setBookForm({
      type: b.type || "",
      author_name: b.author_name || "",
      title: b.title || "",
      publisher_name: b.publisher_name || "",
      publisher_address: b.publisher_address || "",
      isbn_issn: b.isbn_issn || "",
      page_from: b.page_from || "",
      page_to: b.page_to || "",
      month: b.month || "",
      year: b.year || "",
      url: b.url || "",
    });
  };

  // ===== SELECT AWARD =====
  const selectAward = (a) => {
    setSelectedAwardId(a.id);
    setSelectedMembershipId(null);
    setSelectedBookId(null);
    setSelectedPublicationId(null);
    setSelectedConferenceId(null);
    setAwardForm({
      awardName: a.award_name || "",
      awardingAgent: a.awarding_agent || "",
      awardYear: a.award_year || "",
    });
  };

  // ===== SELECT PUBLICATION =====
  const selectPublication = (p) => {
    setSelectedPublicationId(p.id);
    setSelectedMembershipId(null);
    setSelectedBookId(null);
    setSelectedAwardId(null);
    setSelectedConferenceId(null);
    setPublicationForm({
      scope: p.scope || "",
      publishedMonth: p.published_month || "",
      publishedYear: p.published_year || "",
      authors: p.authors || "",
      paperTitle: p.paper_title || "",
      journalName: p.journal_name || "",
      volumeNumber: p.volume_number || "",
      issueNumber: p.issue_number || "",
      publicationYearOrDoi: p.publication_year_or_doi || "",
      pageFrom: p.page_from || "",
      pageTo: p.page_to || "",
    });
  };

  // ===== SELECT CONFERENCE =====
  const selectConference = (c) => {
    setSelectedConferenceId(c.id);
    setSelectedMembershipId(null);
    setSelectedBookId(null);
    setSelectedAwardId(null);
    setSelectedPublicationId(null);
    setConferenceForm({
      conference_type: c.conference_type || "",
      activity_type: c.activity_type || "",
      author_name: c.author_name || "",
      publication_year: c.publication_year || "",
      paper_title: c.paper_title || "",
      conference_title: c.conference_title || "",
      conference_from: c.conference_from || "",
      conference_to: c.conference_to || "",
      location: c.location || "",
      page_from: c.page_from || "",
      page_to: c.page_to || "",
      place_of_publication: c.place_of_publication || "",
      publisher: c.publisher || "",
    });
  };

  // ===== FORM CHANGES =====
  const handleMembershipChange = (e) =>
    setMembershipForm({ ...membershipForm, [e.target.name]: e.target.value });

  const handleBookChange = (e) =>
    setBookForm({ ...bookForm, [e.target.name]: e.target.value });

  const handleAwardChange = (e) =>
    setAwardForm({ ...awardForm, [e.target.name]: e.target.value });

  const handlePublicationChange = (e) =>
    setPublicationForm({ ...publicationForm, [e.target.name]: e.target.value });

  const handleConferenceChange = (e) =>
    setConferenceForm({ ...conferenceForm, [e.target.name]: e.target.value });

  // ===== UPDATE MEMBERSHIP =====
  const handleMembershipSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMembershipId) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateMembership(selectedMembershipId, membershipForm);
      setSuccess("Membership updated successfully");

      setMemberships((prev) =>
        prev.map((m) =>
          m.id === selectedMembershipId ? { ...m, ...membershipForm } : m
        )
      );
      setSelectedMembershipId(null);
      setMembershipForm({
        membershipType: "",
        institution: "",
        membershipId: "",
      });
    } catch {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== UPDATE BOOK =====
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookId) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateBookByStaff(selectedBookId, bookForm);
      setSuccess("Book/Publication updated successfully");

      setBooks((prev) =>
        prev.map((b) => (b.id === selectedBookId ? { ...b, ...bookForm } : b))
      );
      setSelectedBookId(null);
      setBookForm({
        type: "",
        author_name: "",
        title: "",
        publisher_name: "",
        publisher_address: "",
        isbn_issn: "",
        page_from: "",
        page_to: "",
        month: "",
        year: "",
        url: "",
      });
    } catch {
      setError("Book update failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== UPDATE AWARD =====
  const handleAwardSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAwardId) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateAward(selectedAwardId, awardForm);
      setSuccess("Award updated successfully");

      setAwards((prev) =>
        prev.map((a) =>
          a.id === selectedAwardId
            ? {
                ...a,
                award_name: awardForm.awardName,
                awarding_agent: awardForm.awardingAgent,
                award_year: awardForm.awardYear,
              }
            : a
        )
      );
      setSelectedAwardId(null);
      setAwardForm({
        awardName: "",
        awardingAgent: "",
        awardYear: "",
      });
    } catch {
      setError("Award update failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== UPDATE PUBLICATION =====
  const handlePublicationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPublicationId) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updatePublication(selectedPublicationId, publicationForm);
      setSuccess("Publication updated successfully");

      setPublications((prev) =>
        prev.map((p) =>
          p.id === selectedPublicationId
            ? {
                ...p,
                scope: publicationForm.scope,
                published_month: publicationForm.publishedMonth,
                published_year: publicationForm.publishedYear,
                authors: publicationForm.authors,
                paper_title: publicationForm.paperTitle,
                journal_name: publicationForm.journalName,
                volume_number: publicationForm.volumeNumber,
                issue_number: publicationForm.issueNumber,
                publication_year_or_doi: publicationForm.publicationYearOrDoi,
                page_from: publicationForm.pageFrom,
                page_to: publicationForm.pageTo,
              }
            : p
        )
      );
      setSelectedPublicationId(null);
      setPublicationForm({
        scope: "",
        publishedMonth: "",
        publishedYear: "",
        authors: "",
        paperTitle: "",
        journalName: "",
        volumeNumber: "",
        issueNumber: "",
        publicationYearOrDoi: "",
        pageFrom: "",
        pageTo: "",
      });
    } catch {
      setError("Publication update failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== UPDATE CONFERENCE =====
  const handleConferenceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedConferenceId) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      Object.keys(conferenceForm).forEach((key) => {
        if (conferenceForm[key]) {
          formData.append(key, conferenceForm[key]);
        }
      });

      await updateConference(selectedConferenceId, formData);
      setSuccess("Conference updated successfully");

      setConferences((prev) =>
        prev.map((c) =>
          c.id === selectedConferenceId ? { ...c, ...conferenceForm } : c
        )
      );
      setSelectedConferenceId(null);
      setConferenceForm({
        conference_type: "",
        activity_type: "",
        author_name: "",
        publication_year: "",
        paper_title: "",
        conference_title: "",
        conference_from: "",
        conference_to: "",
        location: "",
        page_from: "",
        page_to: "",
        place_of_publication: "",
        publisher: "",
      });
    } catch {
      setError("Conference update failed");
    } finally {
      setLoading(false);
    }
  };

  const clearSelections = () => {
    setSelectedMembershipId(null);
    setSelectedBookId(null);
    setSelectedAwardId(null);
    setSelectedPublicationId(null);
    setSelectedConferenceId(null);
    setError("");
    setSuccess("");
  };

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
        <Sidebar />

        <div style={{ 
          flex: 1, 
          display: "flex", 
          justifyContent: "right",
          padding: "40px 20px",
          paddingRight: "100px"
        }}>
          <div style={{ 
            width: "100%", 
            maxWidth: "1000px"
          }}>
            {/* ===== HEADER ===== */}
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ 
                fontSize: 36, 
                fontWeight: 700, 
                color: "#1e293b",
                marginBottom: 8,
                letterSpacing: "-0.5px"
              }}>
                Edit Profile
              </h1>
              <p style={{ color: "#64748b", fontSize: 15 }}>
                Staff ID: <strong>{staffId}</strong>
              </p>
            </div>

            {/* ===== MESSAGES ===== */}
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 20,
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#16a34a",
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 20,
                }}
              >
                ✅ {success}
              </div>
            )}

            {/* ===== TABS ===== */}
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  borderBottom: "2px solid #e2e8f0",
                  flexWrap: "wrap",
                }}
              >
                <TabButton
                  active={activeTab === "memberships"}
                  onClick={() => {
                    setActiveTab("memberships");
                    clearSelections();
                  }}
                  icon="📋"
                  label="Memberships"
                />
                <TabButton
                  active={activeTab === "books"}
                  onClick={() => {
                    setActiveTab("books");
                    clearSelections();
                  }}
                  icon="📚"
                  label="Books / Popular Article"
                />
                <TabButton
                  active={activeTab === "publications"}
                  onClick={() => {
                    setActiveTab("publications");
                    clearSelections();
                  }}
                  icon="📄"
                  label="Publications"
                />
                <TabButton
                  active={activeTab === "conferences"}
                  onClick={() => {
                    setActiveTab("conferences");
                    clearSelections();
                  }}
                  icon="🎤"
                  label="Conferences"
                />
                <TabButton
                  active={activeTab === "awards"}
                  onClick={() => {
                    setActiveTab("awards");
                    clearSelections();
                  }}
                  icon="🏆"
                  label="Awards"
                />
              </div>
            </div>

            {/* ===== MEMBERSHIPS TAB ===== */}
            {activeTab === "memberships" && (
              <>
                <SectionHeader title="Memberships" count={memberships.length} />

                {memberships.length === 0 && (
                  <EmptyState message="No memberships available." />
                )}

                {memberships.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {memberships.map((m) => (
                      <ItemCard
                        key={m.id}
                        selected={selectedMembershipId === m.id}
                        onClick={() => selectMembership(m)}
                        title={m.membershipType}
                        subtitle={`${m.institution} • ID: ${m.membershipId}`}
                      />
                    ))}
                  </div>
                )}

                {selectedMembershipId && (
                  <FormCard title="Edit Membership">
                    <form onSubmit={handleMembershipSubmit}>
                      <InputField
                        label="Membership Type"
                        name="membershipType"
                        value={membershipForm.membershipType}
                        onChange={handleMembershipChange}
                      />
                      <InputField
                        label="Institution"
                        name="institution"
                        value={membershipForm.institution}
                        onChange={handleMembershipChange}
                      />
                      <InputField
                        label="Membership ID"
                        name="membershipId"
                        value={membershipForm.membershipId}
                        onChange={handleMembershipChange}
                      />
                      <SubmitButton loading={loading} text="Update Membership" />
                    </form>
                  </FormCard>
                )}
              </>
            )}

            {/* ===== BOOKS TAB ===== */}
            {activeTab === "books" && (
              <>
                <SectionHeader title="Books & Publications" count={books.length} />

                {books.length === 0 && (
                  <EmptyState message="No books or publications available." />
                )}

                {books.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {books.map((b) => (
                      <ItemCard
                        key={b.id}
                        selected={selectedBookId === b.id}
                        onClick={() => selectBook(b)}
                        title={b.title}
                        subtitle={`${b.type} • ${b.author_name} • ${b.year}`}
                      />
                    ))}
                  </div>
                )}

                {selectedBookId && (
                  <FormCard title="Edit Book/Publication">
                    <form onSubmit={handleBookSubmit}>
                      <SelectField
                        label="Type"
                        name="type"
                        value={bookForm.type}
                        onChange={handleBookChange}
                        options={[
                          { value: "", label: "Select Type" },
                          { value: "Book", label: "Book" },
                          { value: "Article", label: "Article" },
                          { value: "Chapter", label: "Book Chapter" },
                          { value: "Paper", label: "Conference Paper" },
                        ]}
                      />
                      <InputField
                        label="Author Name"
                        name="author_name"
                        value={bookForm.author_name}
                        onChange={handleBookChange}
                      />
                      <InputField
                        label="Title"
                        name="title"
                        value={bookForm.title}
                        onChange={handleBookChange}
                      />
                      <InputField
                        label="Publisher Name"
                        name="publisher_name"
                        value={bookForm.publisher_name}
                        onChange={handleBookChange}
                      />
                      <InputField
                        label="Publisher Address"
                        name="publisher_address"
                        value={bookForm.publisher_address}
                        onChange={handleBookChange}
                      />
                      <InputField
                        label="ISBN/ISSN"
                        name="isbn_issn"
                        value={bookForm.isbn_issn}
                        onChange={handleBookChange}
                      />
                      <div style={{ display: "flex", gap: 16 }}>
                        <InputField
                          label="Page From"
                          name="page_from"
                          value={bookForm.page_from}
                          onChange={handleBookChange}
                        />
                        <InputField
                          label="Page To"
                          name="page_to"
                          value={bookForm.page_to}
                          onChange={handleBookChange}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 16 }}>
                        <InputField
                          label="Month"
                          name="month"
                          value={bookForm.month}
                          onChange={handleBookChange}
                        />
                        <InputField
                          label="Year"
                          name="year"
                          value={bookForm.year}
                          onChange={handleBookChange}
                        />
                      </div>
                      <InputField
                        label="URL"
                        name="url"
                        value={bookForm.url}
                        onChange={handleBookChange}
                      />
                      <SubmitButton loading={loading} text="Update Book/Publication" />
                    </form>
                  </FormCard>
                )}
              </>
            )}

            {/* ===== PUBLICATIONS TAB ===== */}
            {activeTab === "publications" && (
              <>
                <SectionHeader title="Journal Publications" count={publications.length} />

                {publications.length === 0 && (
                  <EmptyState message="No publications available." />
                )}

                {publications.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {publications.map((p) => (
                      <ItemCard
                        key={p.id}
                        selected={selectedPublicationId === p.id}
                        onClick={() => selectPublication(p)}
                        title={p.paper_title}
                        subtitle={`${p.journal_name} • ${p.scope} • ${p.published_year}`}
                      />
                    ))}
                  </div>
                )}

                {selectedPublicationId && (
                  <FormCard title="Edit Publication">
                    <form onSubmit={handlePublicationSubmit}>
                      <SelectField
                        label="Scope"
                        name="scope"
                        value={publicationForm.scope}
                        onChange={handlePublicationChange}
                        options={[
                          { value: "", label: "Select Scope" },
                          { value: "International", label: "International" },
                          { value: "National", label: "National" },
                        ]}
                      />
                      <InputField
                        label="Authors"
                        name="authors"
                        value={publicationForm.authors}
                        onChange={handlePublicationChange}
                      />
                      <InputField
                        label="Paper Title"
                        name="paperTitle"
                        value={publicationForm.paperTitle}
                        onChange={handlePublicationChange}
                      />
                      <InputField
                        label="Journal Name"
                        name="journalName"
                        value={publicationForm.journalName}
                        onChange={handlePublicationChange}
                      />
                      <div style={{ display: "flex", gap: 16 }}>
                        <InputField
                          label="Published Month"
                          name="publishedMonth"
                          value={publicationForm.publishedMonth}
                          onChange={handlePublicationChange}
                        />
                        <InputField
                          label="Published Year"
                          name="publishedYear"
                          value={publicationForm.publishedYear}
                          onChange={handlePublicationChange}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 16 }}>
                        <InputField
                          label="Volume Number"
                          name="volumeNumber"
                          value={publicationForm.volumeNumber}
                          onChange={handlePublicationChange}
                        />
                        <InputField
                          label="Issue Number"
                          name="issueNumber"
                          value={publicationForm.issueNumber}
                          onChange={handlePublicationChange}
                        />
                      </div>
                      <InputField
                        label="Publication Year / DOI"
                        name="publicationYearOrDoi"
                        value={publicationForm.publicationYearOrDoi}
                        onChange={handlePublicationChange}
                      />
                      <div style={{ display: "flex", gap: 16 }}>
                        <InputField
                          label="Page From"
                          name="pageFrom"
                          value={publicationForm.pageFrom}
                          onChange={handlePublicationChange}
                        />
                        <InputField
                          label="Page To"
                          name="pageTo"
                          value={publicationForm.pageTo}
                          onChange={handlePublicationChange}
                        />
                      </div>
                      <SubmitButton loading={loading} text="Update Publication" />
                    </form>
                  </FormCard>
                )}
              </>
            )}

            {/* ===== CONFERENCES TAB ===== */}
            {activeTab === "conferences" && (
              <>
                <SectionHeader title="Conferences" count={conferences.length} />

                {conferences.length === 0 && (
                  <EmptyState message="No conferences available." />
                )}

                {conferences.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {conferences.map((c) => (
                      <ItemCard
                        key={c.id}
                        selected={selectedConferenceId === c.id}
                        onClick={() => selectConference(c)}
                        title={c.conference_title}
                        subtitle={`${c.activity_type} • ${c.location} • ${c.conference_from}`}
                      />
                    ))}
                  </div>
                )}

                {selectedConferenceId && (
                  <FormCard title="Edit Conference">
                    <form onSubmit={handleConferenceSubmit}>
                      <SelectField
                        label="Conference Type"
                        name="conference_type"
                        value={conferenceForm.conference_type}
                        onChange={handleConferenceChange}
                        options={[
                          { value: "", label: "Select Type" },
                          { value: "International", label: "International" },
                          { value: "National", label: "National" },
                        ]}
                      />
                      <SelectField
                        label="Activity Type"
                        name="activity_type"
                        value={conferenceForm.activity_type}
                        onChange={handleConferenceChange}
                        options={[
                          { value: "", label: "Select Activity" },
                          { value: "Paper Published", label: "Paper Published" },
                          { value: "Conference Attended", label: "Conference Attended" },
                        ]}
                      />
                      
                      {conferenceForm.activity_type === "Paper Published" && (
                        <>
                          <InputField
                            label="Author Name"
                            name="author_name"
                            value={conferenceForm.author_name}
                            onChange={handleConferenceChange}
                          />
                          <InputField
                            label="Publication Year"
                            name="publication_year"
                            value={conferenceForm.publication_year}
                            onChange={handleConferenceChange}
                          />
                          <InputField
                            label="Paper Title"
                            name="paper_title"
                            value={conferenceForm.paper_title}
                            onChange={handleConferenceChange}
                          />
                        </>
                      )}

                      <InputField
                        label="Conference Title"
                        name="conference_title"
                        value={conferenceForm.conference_title}
                        onChange={handleConferenceChange}
                      />
                      <div style={{ display: "flex", gap: 16 }}>
                        <InputField
                          label="Conference From"
                          name="conference_from"
                          type="date"
                          value={conferenceForm.conference_from}
                          onChange={handleConferenceChange}
                        />
                        <InputField
                          label="Conference To"
                          name="conference_to"
                          type="date"
                          value={conferenceForm.conference_to}
                          onChange={handleConferenceChange}
                        />
                      </div>
                      <InputField
                        label="Location"
                        name="location"
                        value={conferenceForm.location}
                        onChange={handleConferenceChange}
                      />

                      {conferenceForm.activity_type === "Paper Published" && (
                        <>
                          <div style={{ display: "flex", gap: 16 }}>
                            <InputField
                              label="Page From"
                              name="page_from"
                              value={conferenceForm.page_from}
                              onChange={handleConferenceChange}
                            />
                            <InputField
                              label="Page To"
                              name="page_to"
                              value={conferenceForm.page_to}
                              onChange={handleConferenceChange}
                            />
                          </div>
                          <InputField
                            label="Place of Publication"
                            name="place_of_publication"
                            value={conferenceForm.place_of_publication}
                            onChange={handleConferenceChange}
                          />
                          <InputField
                            label="Publisher"
                            name="publisher"
                            value={conferenceForm.publisher}
                            onChange={handleConferenceChange}
                          />
                        </>
                      )}

                      <SubmitButton loading={loading} text="Update Conference" />
                    </form>
                  </FormCard>
                )}
              </>
            )}

            {/* ===== AWARDS TAB ===== */}
            {activeTab === "awards" && (
              <>
                <SectionHeader title="Awards & Honors" count={awards.length} />

                {awards.length === 0 && (
                  <EmptyState message="No awards available." />
                )}

                {awards.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {awards.map((a) => (
                      <ItemCard
                        key={a.id}
                        selected={selectedAwardId === a.id}
                        onClick={() => selectAward(a)}
                        title={a.award_name}
                        subtitle={`${a.awarding_agent} • ${a.award_year}`}
                      />
                    ))}
                  </div>
                )}

                {selectedAwardId && (
                  <FormCard title="Edit Award">
                    <form onSubmit={handleAwardSubmit}>
                      <InputField
                        label="Award Name"
                        name="awardName"
                        value={awardForm.awardName}
                        onChange={handleAwardChange}
                      />
                      <InputField
                        label="Awarding Agent"
                        name="awardingAgent"
                        value={awardForm.awardingAgent}
                        onChange={handleAwardChange}
                      />
                      <InputField
                        label="Award Year"
                        name="awardYear"
                        value={awardForm.awardYear}
                        onChange={handleAwardChange}
                      />
                      <SubmitButton loading={loading} text="Update Award" />
                    </form>
                  </FormCard>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ===== REUSABLE COMPONENTS ===== */

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 24px",
        background: "none",
        border: "none",
        borderBottom: active ? "3px solid #2563eb" : "3px solid transparent",
        color: active ? "#2563eb" : "#64748b",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        fontSize: 16,
        transition: "all 0.2s",
      }}
    >
      {icon} {label}
    </button>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        marginTop: 8,
      }}
    >
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1e293b" }}>
        {title}
      </h2>
      <span
        style={{
          background: "#dbeafe",
          color: "#1e40af",
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {count} Total
      </span>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: 48,
        color: "#94a3b8",
        background: "white",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
      }}
    >
      {message}
    </div>
  );
}

function ItemCard({ selected, onClick, title, subtitle }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "20px 24px",
        cursor: "pointer",
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "all 0.2s",
        boxShadow: selected
          ? "0 4px 12px rgba(37, 99, 235, 0.15)"
          : "0 1px 3px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
        }
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 600,
            color: "#1e293b",
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 14, color: "#64748b" }}>{subtitle}</div>
      </div>
      <div
        style={{
          color: "#2563eb",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {selected ? "✓ Selected" : "Edit →"}
      </div>
    </div>
  );
}

function FormCard({ title, children }) {
  return (
    <div
      style={{
        background: "white",
        padding: 28,
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        marginTop: 24,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 24,
          color: "#1e293b",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 8,
          color: "#334155",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "11px 14px",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          fontSize: 14,
          outline: "none",
          transition: "all 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#2563eb";
          e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e2e8f0";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 8,
          color: "#334155",
        }}
      >
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "11px 14px",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          fontSize: 14,
          outline: "none",
          background: "white",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#2563eb";
          e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e2e8f0";
          e.target.style.boxShadow = "none";
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SubmitButton({ loading, text }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: 14,
        background: loading ? "#94a3b8" : "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        marginTop: 8,
        transition: "background 0.2s",
      }}
    >
      {loading ? "Updating..." : text}
    </button>
  );
}

export default EditMembership;