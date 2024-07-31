const { contactModel } = require("../mongoConnection"); 

const getall = async (req, res, next) => {
  try {
    const allcontacts = await contactModel.find({user_id:req.user.id});
    res.status(200).json(allcontacts);
  } catch (error) {
    next(error);
  }
};

const getcontact = async (req, res, next) => {
  try {
    const getid = await contactModel.findById(req.params.id);
    if (getid && getid.user_id==req.user.id) {
      res.status(200).json(getid);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    next(error);
  }
};

const postcontact = async (req, res, next) => {
  const { name, phoneno } = req.body;

  if (name && phoneno) {
    try {
      const newUser = await contactModel.create({ name, phoneno,user_id:req.user.id });
      res.status(201).json({ message: "Created successfully", newUser });
    } catch (error) {
      next(error);
    }
  } else {
    const error = new Error("Can't create: missing name or phone number");
    res.status(400);
    next(error);
  }
};

const putcontact = async (req, res, next) => {
  const { name, phoneno } = req.body;

  if (!name || !phoneno) {
    const error = new Error("Can't update: missing name or phone number");
    res.status(400);
    return next(error);
  }

  try {
    const contact = await contactModel.findById(req.params.id);

    if (!contact) {
      const error = new Error("Contact not found");
      res.status(404);
      return next(error);
    }

    if (contact.user_id.toString() !== req.user.id) {
      const error = new Error("User doesn't have permission to update this contact");
      res.status(403);
      return next(error);
    }

    const updatedUser = await contactModel.findByIdAndUpdate(
      req.params.id,
      { name, phoneno },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).send('User not found');
    } else {
      res.status(200).json({ message: "Updated successfully", updatedUser });
    }
  } catch (error) {
    next(error);
  }
};


const deletecontact = async (req, res, next) => {
  try {
    const contact = await contactModel.findById(req.params.id);

    if (!contact) {
      const error = new Error("Contact not found");
      res.status(404);
      return next(error);
    }

    if (contact.user_id.toString() !== req.user.id) {
      const error = new Error("User doesn't have permission to delete this contact");
      res.status(403);
      return next(error);
    }

    const user = await contactModel.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(200).json({ message: "User deleted successfully", user });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    next(error);
  }
};


module.exports = { getall, getcontact, postcontact, putcontact, deletecontact };
