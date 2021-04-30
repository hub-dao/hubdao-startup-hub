const { expectRevert, time } = require('@openzeppelin/test-helpers');
const MockHRC20 = artifacts.require('MockHRC20');
const IHO = artifacts.require('IHO');

contract('IHO', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.lp = await MockHRC20.new('LPToken', 'LP1', '1000000', { from: minter });
    this.ihoToken = await MockHRC20.new('WOW', 'WOW', '1000000', { from: minter });

    await this.lp.transfer(bob, '10', { from: minter });
    await this.lp.transfer(alice, '10', { from: minter });
    await this.lp.transfer(carol, '10', { from: minter });
  });

  it('raise not enough lp', async () => {
    // 10 lp raising, 100 iho to offer
    this.iho = await IHO.new(this.lp.address, this.ihoToken.address, '20', '30', '100', '10', alice, { from: minter });
    await this.ihoToken.transfer(this.iho.address, '100', { from: minter });

    await this.lp.approve(this.iho.address, '1000', { from: alice });
    await this.lp.approve(this.iho.address, '1000', { from: bob });
    await this.lp.approve(this.iho.address, '1000', { from: carol });
    await expectRevert(
      this.iho.deposit('1', {from: bob}),
      'not iho time',
    );

    await time.advanceBlockTo('20');

    await this.iho.deposit('1', {from: bob});
    await this.iho.deposit('2', {from: alice});
    await this.iho.deposit('3', {from: carol});
    assert.equal((await this.iho.totalAmount()).toString(), '6');
    assert.equal((await this.iho.getUserAllocation(carol)).toString(), '500000');
    assert.equal((await this.iho.getUserAllocation(alice)).toString(), '333333');
    assert.equal((await this.iho.getOfferingAmount(carol)).toString(), '30');
    assert.equal((await this.iho.getOfferingAmount(bob)).toString(), '10');
    assert.equal((await this.iho.getRefundingAmount(bob)).toString(), '0');
    await expectRevert(
      this.iho.harvest({from: bob}),
      'not harvest time',
    );

    await time.advanceBlockTo('30');
    assert.equal((await this.lp.balanceOf(carol)).toString(), '7');
    assert.equal((await this.ihoToken.balanceOf(carol)).toString(), '0');
    await this.iho.harvest({from: carol});
    assert.equal((await this.lp.balanceOf(carol)).toString(), '7');
    assert.equal((await this.ihoToken.balanceOf(carol)).toString(), '30');
    await expectRevert(
      this.iho.harvest({from: carol}),
      'nothing to harvest',
    );

  })

  it('raise enough++ lp', async () => {
    // 10 lp raising, 100 iho to offer
    this.iho = await IHO.new(this.lp.address, this.ihoToken.address, '50', '100', '100', '10', alice, { from: minter });
    await this.ihoToken.transfer(this.iho.address, '100', { from: minter });

    await this.lp.approve(this.iho.address, '1000', { from: alice });
    await this.lp.approve(this.iho.address, '1000', { from: bob });
    await this.lp.approve(this.iho.address, '1000', { from: carol });
    await expectRevert(
      this.iho.deposit('1', {from: bob}),
      'not iho time',
    );

    await time.advanceBlockTo('50');

    await this.iho.deposit('1', {from: bob});
    await this.iho.deposit('2', {from: alice});
    await this.iho.deposit('3', {from: carol});
    await this.iho.deposit('1', {from: bob});
    await this.iho.deposit('2', {from: alice});
    await this.iho.deposit('3', {from: carol});
    await this.iho.deposit('1', {from: bob});
    await this.iho.deposit('2', {from: alice});
    await this.iho.deposit('3', {from: carol});
    assert.equal((await this.iho.totalAmount()).toString(), '18');
    assert.equal((await this.iho.getUserAllocation(carol)).toString(), '500000');
    assert.equal((await this.iho.getUserAllocation(alice)).toString(), '333333');
    assert.equal((await this.iho.getOfferingAmount(carol)).toString(), '50');
    assert.equal((await this.iho.getOfferingAmount(bob)).toString(), '16');
    assert.equal((await this.iho.getRefundingAmount(carol)).toString(), '4');
    assert.equal((await this.iho.getRefundingAmount(bob)).toString(), '2');
    await expectRevert(
      this.iho.harvest({from: bob}),
      'not harvest time',
    );
    assert.equal((await this.iho.totalAmount()).toString(), '18');

    await time.advanceBlockTo('100');
    assert.equal((await this.lp.balanceOf(carol)).toString(), '1');
    assert.equal((await this.ihoToken.balanceOf(carol)).toString(), '0');
    await this.iho.harvest({from: carol});
    assert.equal((await this.lp.balanceOf(carol)).toString(), '5');
    assert.equal((await this.ihoToken.balanceOf(carol)).toString(), '50');
    await expectRevert(
      this.iho.harvest({from: carol}),
      'nothing to harvest',
    );
    assert.equal((await this.iho.hasHarvest(carol)).toString(), 'true');
    assert.equal((await this.iho.hasHarvest(bob)).toString(), 'false');

  })

  it('raise enough lp', async () => {
    // 10 lp raising, 100 iho to offer
    this.iho = await IHO.new(this.lp.address, this.ihoToken.address, '120', '170', '18', '18', alice, { from: minter });
    await this.ihoToken.transfer(this.iho.address, '100', { from: minter });

    await this.lp.approve(this.iho.address, '1000', { from: alice });
    await this.lp.approve(this.iho.address, '1000', { from: bob });
    await this.lp.approve(this.iho.address, '1000', { from: carol });
    await expectRevert(
      this.iho.deposit('1', {from: bob}),
      'not iho time',
    );

    await time.advanceBlockTo('120');

    await this.iho.deposit('1', {from: bob});
    await this.iho.deposit('2', {from: alice});
    await this.iho.deposit('3', {from: carol});
    await this.iho.deposit('1', {from: bob});
    await this.iho.deposit('2', {from: alice});
    await this.iho.deposit('3', {from: carol});
    await this.iho.deposit('1', {from: bob});
    await this.iho.deposit('2', {from: alice});
    await this.iho.deposit('3', {from: carol});
    assert.equal((await this.iho.totalAmount()).toString(), '18');
    assert.equal((await this.iho.getUserAllocation(carol)).toString(), '500000');
    assert.equal((await this.iho.getUserAllocation(alice)).toString(), '333333');
    assert.equal((await this.iho.getOfferingAmount(carol)).toString(), '9');
    assert.equal((await this.iho.getOfferingAmount(minter)).toString(), '0');
    assert.equal((await this.iho.getOfferingAmount(bob)).toString(), '3');
    assert.equal((await this.iho.getRefundingAmount(carol)).toString(), '0');
    assert.equal((await this.iho.getRefundingAmount(bob)).toString(), '0');
    await expectRevert(
      this.iho.harvest({from: bob}),
      'not harvest time',
    );
    assert.equal((await this.iho.totalAmount()).toString(), '18');

    await time.advanceBlockTo('170');
    assert.equal((await this.lp.balanceOf(carol)).toString(), '1');
    assert.equal((await this.ihoToken.balanceOf(carol)).toString(), '0');
    await this.iho.harvest({from: carol});
    assert.equal((await this.lp.balanceOf(carol)).toString(), '1');
    assert.equal((await this.ihoToken.balanceOf(carol)).toString(), '9');
    await expectRevert(
      this.iho.harvest({from: carol}),
      'nothing to harvest',
    );
    assert.equal((await this.iho.hasHarvest(carol)).toString(), 'true');
    assert.equal((await this.iho.hasHarvest(bob)).toString(), 'false');
    assert.equal((await this.iho.getAddressListLength()).toString(), '3');

  })
});
