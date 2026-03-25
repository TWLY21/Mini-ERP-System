const express = require("express");

const departmentController = require("../controllers/departmentController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.use(authenticate);

router.get("/", asyncHandler(departmentController.getDepartments));
router.get("/:id", asyncHandler(departmentController.getDepartment));
router.post(
  "/",
  authorize("admin", "manager"),
  asyncHandler(departmentController.createDepartment)
);
router.put(
  "/:id",
  authorize("admin", "manager"),
  asyncHandler(departmentController.updateDepartment)
);
router.delete(
  "/:id",
  authorize("admin"),
  asyncHandler(departmentController.deleteDepartment)
);

module.exports = router;
