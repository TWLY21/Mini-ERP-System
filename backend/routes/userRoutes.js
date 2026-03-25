const express = require("express");

const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.use(authenticate);

router.get(
  "/employees",
  authorize("admin", "manager"),
  asyncHandler(userController.getEmployees)
);

router.use(authorize("admin"));

router.get("/", asyncHandler(userController.getUsers));
router.get("/:id", asyncHandler(userController.getUser));
router.post("/", asyncHandler(userController.createUser));
router.put("/:id", asyncHandler(userController.updateUser));
router.delete("/:id", asyncHandler(userController.deleteUser));

module.exports = router;
