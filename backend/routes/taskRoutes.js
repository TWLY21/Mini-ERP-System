const express = require("express");

const taskController = require("../controllers/taskController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.use(authenticate);

router.get("/", asyncHandler(taskController.getTasks));
router.get("/:id", asyncHandler(taskController.getTask));
router.post(
  "/",
  authorize("admin", "manager"),
  asyncHandler(taskController.createTask)
);
router.put(
  "/:id",
  authorize("admin", "manager"),
  asyncHandler(taskController.updateTask)
);
router.patch("/:id/status", asyncHandler(taskController.updateTaskStatus));
router.delete(
  "/:id",
  authorize("admin", "manager"),
  asyncHandler(taskController.deleteTask)
);

module.exports = router;
