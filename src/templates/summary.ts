//default summary template
export const DEFAULT_JOB_SUMMARY_TEMPLATE = `
<% if (it.displayWorkflowUrl) { %>
You can follow the dispatched workflow <%~ it.dispatchedWorkflow.name %> [here](<%~ it.dispatchedWorkflow.url %>).  
<% } else { %>
Workflow <%~ it.dispatchedWorkflow.name %> has been triggered.  
<% } %>  
<% if (it.dispatchingWorkflow.repo.name !== it.dispatchedWorkflow.repo.name) { %>
  
> [!NOTE]
> The dispatched workflow is from a different repository [<%~ it.dispatchedWorkflow.repo.name %>](<%~ it.dispatchedWorkflow.repo.url %>).
<% } %>
<%- if (it.waitForCompletion) { -%>
<%- if (it.dispatchedWorkflow.conclusion == 'success') { -%>
✅ Workflow successful
<%- } else if (it.dispatchedWorkflow.conclusion == 'failure') { -%>
❌ Workflow failed
<%- } else if (it.dispatchedWorkflow.conclusion == 'cancelled') { -%>
✖️ Workflow cancelled
<%- } else { -%>
⁉️️ Unknown
<% } %>
<% } %>
`;