require 'spec_helper'

describe "training_gears/new" do
  before(:each) do
    assign(:training_gear, stub_model(TrainingGear).as_new_record)
  end

  it "renders new training_gear form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", training_gears_path, "post" do
    end
  end
end
