import * as api from 'strateegia-api';

export async function gatherGraphData(accessToken, projectId) {

  const cData = {
    nodes: [],
    links: []
  };

  const fData = {};

  const filters = {};

  function addNode(id, title, group, createdAt, dashboardUrl) {
    const date = new Date(createdAt)
    cData.nodes.push({
      "id": id,
      "title": title,
      "group": group,
      "createdAt": date,
      "dashboardUrl": dashboardUrl
    });
  }

  function addLink(source, target) {
    const targetNode = cData.nodes.find(x => x.id === target);
    if (targetNode !== undefined) {
      targetNode.parentId = source;
    }
    const newLink = {
      "source": source,
      "target": target
    };
    cData.links.push(newLink);
  }

  const project = await api.getProjectById(accessToken, projectId);
  if (project.maps.length > 1) {
    const dashboardUrl = `https://app.strateegia.digital/journey/${projectId}`;
    addNode(projectId, project.title, "project", project.created_at, dashboardUrl);
  }
  const mapRequests = [];
  project.maps.forEach(map => {
    const mapId = map.id;
    mapRequests.push(api.getMapById(accessToken, mapId));
  });

  const mapRequestsResult = await Promise.all(mapRequests);
  const allDivPointRequests = [];
  mapRequestsResult.forEach(map => {
    const mapId = map.id;
    const mapTitle = map.title;
    const mapCreatedAt = map.created_at;
    const mapDashboardUrl = `https://app.strateegia.digital/journey/${projectId}/map/${mapId}`;
    addNode(mapId, mapTitle, "map", mapCreatedAt, mapDashboardUrl);
    if (project.maps.length > 1) {
      addLink(projectId, mapId);
    }
    allDivPointRequests.push(api.getAllDivergencePointsByMapId(accessToken, mapId));
  });

  const allDivPointRequestsResult = await Promise.all(allDivPointRequests);
  const allCommentsRequests = [];
  allDivPointRequestsResult.forEach(mapWithDivPoints => {
    mapWithDivPoints.content.forEach(divPoint => {
      const divPointId = divPoint.id;
      const divPointTitle = divPoint.tool.title;
      const divPointCreatedAt = divPoint.created_at;
      const divPointDashboardUrl = `https://app.strateegia.digital/journey/${projectId}/map/${divPoint.map_id}/point/${divPointId}`;
      addNode(divPointId, divPointTitle, "divpoint", divPointCreatedAt, divPointDashboardUrl);
      addLink(divPoint.map_id, divPointId);
      const questions = divPoint.tool.questions;
      questions.forEach(question => {
        const questionId = question.id;
        const questionIdForGraph = `${divPointId}#${questionId}`;
        const questionText = question.question;
        const questionCreatedAt = divPointCreatedAt;
        const questionDashboardUrl = divPointDashboardUrl;
        addNode(questionIdForGraph, questionText, "question", questionCreatedAt, questionDashboardUrl);
        addLink(divPointId, questionIdForGraph);
      });
      allCommentsRequests.push(api.getCommentsGroupedByQuestionReport(accessToken, divPointId));
    });
  });

  const allCommentsRequestsResult = await Promise.all(allCommentsRequests);
  allCommentsRequestsResult.forEach(report => {
    report.forEach(question => {
      question.comments.forEach(comment => {
        const commentId = comment.id;
        const commentText = comment.text;
        const commentCreatedAt = comment.created_at;
        const questionIdForGraph = `${comment.divergence_point_id}#${comment.question_id}`;
        addNode(commentId, commentText, "comment", commentCreatedAt, null);
        addLink(questionIdForGraph, commentId);
        const replies = comment.replies;
        replies.forEach(reply => {
          const replyId = reply.id;
          const replyText = reply.text;
          const replyCreatedAt = reply.created_at;
          addNode(replyId, replyText, "reply", replyCreatedAt, null);
          addLink(commentId, replyId);
          reply.agreements.forEach((agreement, index) => {
            const agreementId = `${replyId}#${index}`;
            const agreementText = "OK";
            const agreementCreatedAt = agreement.created_at;
            addNode(agreementId, agreementText, "agreement", agreementCreatedAt, null);
            addLink(replyId, agreementId);
          });
        });
        const agreements = comment.agreements;
        agreements.forEach((agreement, index) => {
          const agreementId = `${commentId}#${index}`;
          const agreementText = "OK";
          const agreementCreatedAt = agreement.created_at;
          addNode(agreementId, agreementText, "agreement", agreementCreatedAt, null);
          addLink(commentId, agreementId);
        });
      });
    });
  });
  // console.log(cData);
  return cData;
}