function RecentTickets({ recentTickets }) {
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "badge rounded-pill text-primary bg-primary bg-opacity-10"
      case "in-progress":
        return "badge rounded-pill text-info bg-info bg-opacity-10"
      case "pending":
        return "badge rounded-pill text-warning bg-warning bg-opacity-10"
      case "closed":
        return "badge rounded-pill text-success bg-success bg-opacity-10"
      default:
        return "badge rounded-pill text-secondary bg-secondary bg-opacity-10"
    }
  }

  const getPriorityBadgeClass = (priority) => {
    switch (priority.toLowerCase()) {
      case "crítica":
      case "critical":
        return "badge rounded-pill text-danger bg-danger bg-opacity-10"
      case "alta":
      case "high":
        return "badge rounded-pill text-danger bg-danger bg-opacity-10"
      case "media":
      case "medium":
        return "badge rounded-pill text-warning bg-warning bg-opacity-10"
      case "baja":
      case "low":
        return "badge rounded-pill text-primary bg-primary bg-opacity-10"
      default:
        return "badge rounded-pill text-secondary bg-secondary bg-opacity-10"
    }
  }

  const translatePriority = (priority) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "crítica"
      case "high":
        return "alta"
      case "medium":
        return "media"
      case "low":
        return "baja"
      default:
        return priority
    }
  }

  const translateStatus = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "abierto"
      case "in-progress":
        return "en progreso"
      case "pending":
        return "pendiente"
      case "closed":
        return "cerrado"
      default:
        return status
    }
  }

  return (
    <div className="table-responsive">
      <table className="table mb-0">
        <thead>
          <tr className="border-bottom">
            <th
              scope="col"
              className="border-0 text-muted fw-normal text-uppercase px-3 py-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px", width: "10%" }}
            >
              ID
            </th>
            <th
              scope="col"
              className="border-0 text-muted fw-normal text-uppercase px-4 py-3 text-center"
              style={{ fontSize: "11px", letterSpacing: "0.5px", width: "30%" }}
            >
              TITLE
            </th>
            <th
              scope="col"
              className="border-0 text-muted fw-normal text-uppercase px-3 py-3 text-center"
              style={{ fontSize: "11px", letterSpacing: "0.5px", width: "15%" }}
            >
              STATUS
            </th>
            <th
              scope="col"
              className="border-0 text-muted fw-normal text-uppercase px-3 py-3 text-center"
              style={{ fontSize: "11px", letterSpacing: "0.5px", width: "15%" }}
            >
              PRIORITY
            </th>
            <th
              scope="col"
              className="border-0 text-muted fw-normal text-uppercase px-3 py-3 text-center"
              style={{ fontSize: "11px", letterSpacing: "0.5px", width: "15%" }}
            >
              ASSIGNED TO
            </th>
            <th
              scope="col"
              className="border-0 text-muted fw-normal text-uppercase px-4 py-3 text-center"
              style={{ fontSize: "11px", letterSpacing: "0.5px", width: "15%" }}
            >
              CREATED
            </th>
          </tr>
        </thead>
        <tbody>
          {recentTickets.map((ticket, index) => (
            <tr
              key={ticket.id}
              className={`cursor-pointer ${index !== recentTickets.length - 1 ? "border-bottom" : ""}`}
              style={{ borderColor: "#f1f3f4" }}
            >
              <td className="py-3 px-3 border-0">
                <span className="fw-bold text-dark">#{ticket.id}</span>
              </td>
              <td className="py-3 px-4 border-0 text-center">
                <span className="text-muted">{ticket.title}</span>
              </td>
              <td className="py-3 px-3 border-0 text-center">
                <span className={getStatusBadgeClass(ticket.status)}>{translateStatus(ticket.status)}</span>
              </td>
              <td className="py-3 px-3 border-0 text-center">
                <span className={getPriorityBadgeClass(ticket.priority)}>{translatePriority(ticket.priority)}</span>
              </td>
              <td className="py-3 px-3 border-0 text-center">
                <span className="text-muted">{ticket.agent}</span>
              </td>
              <td className="py-3 px-4 border-0 text-center">
                <span className="text-muted">{ticket.created}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentTickets;