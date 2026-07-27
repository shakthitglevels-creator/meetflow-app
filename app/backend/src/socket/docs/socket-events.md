# Socket.IO Events

---

## Client → Server

### meeting:join-room

Description

Join a Socket.IO meeting room.

Payload

```json
{
  "meetingCode": "ABC123"
}
```

Acknowledgement

meeting:joined-room

---

### meeting:leave-room

Description

Leave a Socket.IO meeting room.

Payload

```json
{
  "meetingCode": "ABC123"
}
```

Acknowledgement

meeting:left-room

---

## Server → Client

meeting:joined-room

meeting:left-room

meeting:presence-joined

meeting:presence-left

meeting:error