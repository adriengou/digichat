import { Router } from "express";

let router = Router();

//READ ALL
router.get("/", function (req, res, next) {
  res.json({
    message: "API /Users READ ALL",
  });
});

//READ ONE
router.get("/:id", function (req, res, next) {
  const { id } = req.params;
  res.json({
    message: "API /Users READ ONE",
    id,
  });
});

//CREATE ONE
router.post("/", function (req, res, next) {
  const data = req.body;
  res.json({
    message: "API /Users CREATE ONE",
    data,
  });
});

//UPDATE ONE
router.put("/:id", function (req, res, next) {
  const data = req.body;
  const { id } = req.params;

  res.json({
    message: "API /Users UPDATE ONE",
    id,
    data,
  });
});

//DELETE ONE
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;

  res.json({
    message: "API /Users DELETE ONE",
    id,
  });
});

export default router;
