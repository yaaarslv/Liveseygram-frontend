function changeMessageStatusToREAD(messageIds) {
    fetch('http://localhost:8080/messages/changeMessageStatusToREAD', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageIds)
    });
}