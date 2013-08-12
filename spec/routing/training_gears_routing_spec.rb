require "spec_helper"

describe TrainingGearsController do
  describe "routing" do

    it "routes to #index" do
      get("/training_gears").should route_to("training_gears#index")
    end

    it "routes to #new" do
      get("/training_gears/new").should route_to("training_gears#new")
    end

    it "routes to #show" do
      get("/training_gears/1").should route_to("training_gears#show", :id => "1")
    end

    it "routes to #edit" do
      get("/training_gears/1/edit").should route_to("training_gears#edit", :id => "1")
    end

    it "routes to #create" do
      post("/training_gears").should route_to("training_gears#create")
    end

    it "routes to #update" do
      put("/training_gears/1").should route_to("training_gears#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/training_gears/1").should route_to("training_gears#destroy", :id => "1")
    end

  end
end
