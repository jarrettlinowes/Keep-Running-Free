require 'spec_helper'

describe "training_gears/edit" do
  before(:each) do
    @training_gear = assign(:training_gear, stub_model(TrainingGear))
  end

  it "renders the edit training_gear form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", training_gear_path(@training_gear), "post" do
    end
  end
end
